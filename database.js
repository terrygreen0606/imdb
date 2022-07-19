const mysql = require("mysql");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "imdb",
	multipleStatements: true,
});

db.connect((err) => {
	if (err) throw err;

	console.log("mysql started");
});

module.exports = db;
