const express = require("express");
const router = express.Router();
const db = require("../database");

/**
 * @swagger
 * /movies:
 *   get:
 *     description: Get paginated movies filtered by director and genre
 *     parameters:
 *       - name: page
 *         description: page number of the result
 *         in: query
 *         required: false
 *         type: number
 *       - name: size
 *         description: page size of the result
 *         in: query
 *         required: false
 *         type: number
 *       - name: director
 *         description: director id
 *         in: query
 *         required: false
 *         type: number
 *       - name: genre
 *         description: genre of the movie
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Successful Response of paginated results
 *
 */
router.get("/", (req, res) => {
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

		return res
			.status(200)
			.json({ success: true, result, page: pageNumber, size: pageSize });
	});
});

module.exports = router;
