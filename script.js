const db = require("./database");

const checkIfExists = () => {
	const query = `
    DROP TABLE IF EXISTS movies;
    DROP TABLE IF EXISTS actors;
    DROP TABLE IF EXISTS directors;
    DROP TABLE IF EXISTS movies_genres;
    DROP TABLE IF EXISTS movies_directors;
    DROP TABLE IF EXISTS roles;
  `;
	db.query(query, (err) => {
		if (err) throw err;
	});
};

const importData = () => {
	try {
		checkIfExists();

		// Create Databases
		const query = `
        CREATE TABLE movies(id INT, name VARCHAR(255), year INT, rank FLOAT, PRIMARY KEY(id));
        CREATE TABLE actors(id INT, first_name VARCHAR(255), last_name VARCHAR(255), gender CHAR, PRIMARY KEY(id));
        CREATE TABLE directors(id INT, first_name VARCHAR(255), last_name VARCHAR(255), PRIMARY KEY(id));
        CREATE TABLE movies_genres(movie_id INT, genre VARCHAR(255));
        CREATE TABLE movies_directors(director_id INT, movie_id INT);
        CREATE TABLE roles(actor_id INT, movie_id INT, role VARCHAR(255));
      `;
		db.query(query, (err) => {
			if (err) throw err;
		});

		// Read csv data and import
		// Movies
		const moviesQuery = `LOAD DATA LOCAL INFILE './data/imdb_ijs_movies.csv' INTO TABLE movies FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (id, name, year, rank)`;
		db.query(moviesQuery, (err) => {
			if (err) throw err;
		});

		// Actors
		const actorsQuery = `LOAD DATA LOCAL INFILE './data/imdb_ijs_actors.csv' INTO TABLE actors FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (id, first_name, last_name, gender)`;
		db.query(actorsQuery, (err) => {
			if (err) throw err;
		});

		// Directors
		const directorsQuery = `LOAD DATA LOCAL INFILE './data/imdb_ijs_directors.csv' INTO TABLE directors FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (id, first_name, last_name)`;
		db.query(directorsQuery, (err) => {
			if (err) throw err;
		});

		// Movies_Genres
		const moviesGenresQuery = `LOAD DATA LOCAL INFILE './data/imdb_ijs_movies_genres.csv' INTO TABLE movies_genres FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (movie_id, genre)`;
		db.query(moviesGenresQuery, (err) => {
			if (err) throw err;
		});

		// Movies_Directors
		const moviesDirectorsQuery = `LOAD DATA LOCAL INFILE './data/imdb_ijs_movies_directors.csv' INTO TABLE movies_directors FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (director_id, movie_id)`;
		db.query(moviesDirectorsQuery, (err) => {
			if (err) throw err;
		});

		// Roles
		const rolesQuery = `LOAD DATA LOCAL INFILE './data/imdb_ijs_roles.csv' INTO TABLE roles FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (actor_id, movie_id, role)`;
		db.query(rolesQuery, (err) => {
			if (err) throw err;
		});

		db.end((err) => {
			if (err) throw err;
			console.log("Import finished");
		});
	} catch (error) {
		console.log(error);
	}
};

importData();
