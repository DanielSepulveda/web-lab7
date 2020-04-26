const express = require("express");

// Import Middlewares
const morgan = require("morgan");
const authToken = require("./middleware/authToken");
// Import Routes
const bookmarks = require("./routes/bookmarks");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(authToken);

// Routes
app.use(bookmarks);

app.all("*", (req, res) => {
	console.log("not found");
	res.statusMessage = "Route not found";
	res.status(404).end();
});

app.listen(8080, () => {
	console.log("Ther server is running on port 8080");
});
