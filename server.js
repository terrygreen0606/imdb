const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./database");

const server = express();

// Movies
server.get("/movies", (req, res) => {
	const { page, size, director, genre } = req.query;

	const pageNumber = parseInt(page) || 0;
	const pageSize = parseInt(size) || 10;
	if (pageSize > 100) {
		return res
			.status(400)
			.json({ success: false, error: "Page size is above 100" });
	}

	const skip = pageNumber * pageSize;
	const limit = `${skip},${pageSize}`;
	let query =
		"SELECT m.id, m.name, m.year, m.ranking, mg.genre, md.director_id FROM movies AS m LEFT JOIN movies_genres AS mg ON m.id = mg.movie_id LEFT JOIN movies_directors AS md ON m.id = md.movie_id";

	const genreQuery = ` WHERE mg.genre='${genre}'`;
	const directorQuery = ` WHERE md.director_id=${director}`;
	const genreDirectorQuery = ` WHERE mg.genre='${genre}' AND md.director_id=${director}`;
	if (genre && director) {
		query += genreDirectorQuery;
	} else if (genre) {
		query += genreQuery;
	} else if (director) {
		query += directorQuery;
	}

	query += ` LIMIT ${limit}`;

	db.query(query, (err, result) => {
		if (err) {
			return res.status(500).json({ success: false, error: err });
		}

		return res.status(200).json({ success: true, result });
	});
});

// Actor stats
server.get("/actor_stats/:actorId", (req, res) => {
	const { actorId } = req.params;
	const genreQuery = `
		SELECT actor_id, first_name, last_name,SUM(count_gen) number_of_movies, GROUP_CONCAT(CONCAT(genre,':',count_gen)) number_of_movies_by_genre
		FROM
		(SELECT first_name, last_name, actor_id, genre, count(*) count_gen
		FROM actors
		JOIN roles ON roles.actor_id = actors.id
		JOIN movies_genres gen ON roles.movie_id = gen.movie_id
		WHERE actors.id = ${actorId}
		GROUP BY genre
		) T
		GROUP BY actor_id
	`;

	db.query(genreQuery, (err, result) => {
		if (err) {
			return res.status(500).json({ success: false, error: err });
		}

		const foundActor = result[0];
		const moviesByGenre = foundActor.number_of_movies_by_genre.split(",");

		const numberOfMoviesByGenre = moviesByGenre.map((movieByGenre) => {
			const genre = movieByGenre.split(":")[0];
			const number = parseInt(movieByGenre.split(":")[1]) || 0;
			return {
				genre,
				number,
			};
		});

		const topGenreNumber = Math.max(
			...numberOfMoviesByGenre.map((a) => a.number)
		);
		const topGenre = numberOfMoviesByGenre.find(
			(m) => m.number === topGenreNumber
		);

		const value = {
			id: foundActor.actor_id,
			name: `${foundActor.first_name} ${foundActor.last_name}`,
			top_genre: topGenre,
			number_of_movies: foundActor.number_of_movies,
			number_of_movies_by_genre: numberOfMoviesByGenre,
		};

		const partnerQuery = `
			SELECT * from 
			(SELECT actor_id, relation_id, number_of_shared_movies
			FROM (
			SELECT actor_id, relation_id, COUNT(DISTINCT movie_id) number_of_shared_movies
			FROM (
			SELECT roles.actor_id, r.movie_id, r.actor_id relation_id
			FROM roles
			JOIN roles r ON r.movie_id=roles.movie_id
			) T
			GROUP BY actor_id, relation_id
			) TT WHERE actor_id != relation_id
			) TTT
			JOIN actors ON TTT.relation_id=actors.id
			WHERE actor_id=${actorId}
			ORDER BY number_of_shared_movies
			LIMIT 1
		`;
		db.query(partnerQuery, (err, partnerResult) => {
			if (err) throw err;

			value.most_frequent_partner = {
				partner_actor_id: partnerResult[0].relation_id,
				partner_actor_name: `${partnerResult[0].first_name} ${partnerResult[0].last_name}`,
				number_of_shared_movies: partnerResult[0].number_of_shared_movies,
			};

			return res.status(200).json({ success: true, result: value });
		});
	});
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
