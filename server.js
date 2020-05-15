require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authToken = require("./middleware/authToken");
const cors = require("./middleware/cors");
const bookmarks = require("./routes/bookmarks");

/* Setup Mongoose */
mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});
const db = mongoose.connection;

/* Setup App */
const app = express();

console.log("EXPRESS APP");

// Middlewares
app.use(cors);
app.use(express.static("./public"));
app.use(morgan("dev"));
app.use(authToken);

console.log("ROUTES");

// Routes
app.use(bookmarks);

app.all("*", (req, res) => {
	console.log("not found");
	res.statusMessage = "Route not found";
	res.status(404).end();
});

/* Init */
db.once("open", () => {
	console.log("Connected to the DB");
	app.listen(8080, () => {
		console.log("Ther server is running on port 8080");
	});
});
db.on("error", () => {
	console.log("DB connection error");
});
