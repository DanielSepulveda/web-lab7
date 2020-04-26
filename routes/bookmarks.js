const express = require("express");
const bodyParser = require("body-parser");
const Bookmarks = require("../models/bookmarks");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/bookmarks", (req, res) => {
	const allBookmarks = Bookmarks.find();
	return res.status(200).json(allBookmarks);
});

router.get("/bookmark", (req, res) => {
	const title = req.query.title;

	if (!title) {
		res.statusMessage = "Please send the 'title' as a parameter";

		return res.status(406).end();
	}

	const bookmarks = Bookmarks.find({ title });

	if (!bookmarks.length) {
		res.statusMessage = `There are no bookmarks with the title ${title}`;

		return res.status(404).end();
	}

	return res.status(200).json(bookmarks);
});

router.post("/bookmarks", jsonParser, (req, res) => {
	const values = req.body;

	try {
		Bookmarks.validate(values);
	} catch (e) {
		res.statusMessage = e.errors[0];
		return res.status(406).end();
	}

	Bookmarks.save(values);

	return res.status(201).end();
});

router.delete("/bookmark/:id", (req, res) => {
	const bookmarkId = req.params.id;

	const bookmark = Bookmarks.findOne({ id: bookmarkId });

	if (bookmark === undefined) {
		res.statusMessage = `There is no bookmark with the provided id=${bookmarkId}`;

		return res.status(404).end();
	}

	Bookmarks.delete({ id: bookmarkId });

	return res.status(200).end();
});

router.patch("/bookmark/:id", jsonParser, (req, res) => {
	const bookmarkId = req.params.id;
	const values = req.body;

	if (!values.id) {
		res.statusMessage = "Please send the id in the body of the request";

		return res.status(406).end();
	}

	if (bookmarkId !== values.id) {
		res.statusMessage = "The param id and the body id no not match";

		return res.status(409).end();
	}

	if (!values.update) {
		res.statusMessage =
			"Please send the updated fields inside the 'update' property";

		return res.status(406).end();
	}

	const bookmark = Bookmarks.findOne({ id: bookmarkId });

	if (bookmark === undefined) {
		res.statusMessage = `There is no bookmark with the provided id=${bookmarkId}`;

		return res.status(404).end();
	}

	const updatedBookmark = Bookmarks.update(bookmarkId, values.update);

	res.status(202).json(updatedBookmark);
});

module.exports = router;
