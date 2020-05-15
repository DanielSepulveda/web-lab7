const Bookmark = require("../models/bookmark");
const _ = require("lodash");

exports.bookmarks_list = async (req, res) => {
	const allBookmarks = await Bookmark.find().sort("-createdAt");
	return res.status(200).json(allBookmarks);
};

exports.bookmark_by_title = async (req, res) => {
	const title = req.query.title;

	if (!title) {
		res.statusMessage = "Please send the 'title' as a parameter";

		return res.status(406).end();
	}

	const bookmarks = await Bookmark.find({
		title: { $regex: title, $options: "i" },
	});

	if (!bookmarks.length) {
		res.statusMessage = `There are no bookmarks with the title ${title}`;

		return res.status(404).end();
	}

	return res.status(200).json(bookmarks);
};

exports.create_bookmark = async (req, res) => {
	const values = req.body;

	const newBookmark = new Bookmark(values);

	try {
		await newBookmark.save();
	} catch (e) {
		res.statusMessage = _.values(e.errors)[0].message;
		return res.status(406).end();
	}

	return res.status(201).json(newBookmark);
};

exports.delete_bookmark = async (req, res) => {
	const bookmarkId = req.params.id;

	if ((await Bookmark.findById(bookmarkId)) === null) {
		res.statusMessage = "There is no bookmark with the provided id";

		return res.status(404).end();
	}

	try {
		await Bookmark.findByIdAndDelete(bookmarkId);
	} catch (e) {
		res.statusMessage = _.values(e.errors)[0].message;
		return res.status(404).end();
	}

	return res.status(200).end();
};

exports.update_bookmark = async (req, res) => {
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

	if ((await Bookmark.findById(bookmarkId)) === null) {
		res.statusMessage = "There is no bookmark with the provided id";
		return res.status(404).end();
	}

	try {
		await Bookmark.findByIdAndUpdate(bookmarkId, values.update, {
			runValidators: true,
		});
	} catch (e) {
		if (_.values(e.errors).length) {
			res.statusMessage = _.values(e.errors)[0].message;
		} else {
			res.statusMessage = e.message;
		}
		return res.status(406).end();
	}

	const updatedBookmark = await Bookmark.findById(bookmarkId);

	res.status(202).json(updatedBookmark);
};
