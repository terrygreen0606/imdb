const dotenv = require("dotenv");
dotenv.config();
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const app = require("./app");

const swaggerOptions = {
	definition: {
		info: {
			title: "IMDB API",
			version: "1.0.0",
			description: "Api doc for imdb",
		},
	},
	apis: ["./routes/movies.js", "./routes/actors.js"],
};

const swaggerDocs = swaggerJsDocs(swaggerOptions);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
