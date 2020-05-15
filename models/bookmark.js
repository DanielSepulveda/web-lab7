const mongoose = require("mongoose");
const v4 = require("uuid").v4;
const validateUrl = require("../lib/validateUrl");

const schema = new mongoose.Schema({
	_id: {
		type: String,
		// unique: true,
		default: v4,
	},
	title: {
		type: String,
		required: [true, "Please provide a title"],
	},
	description: {
		type: String,
		required: [true, "Please provide a description"],
	},
	url: {
		type: String,
		required: [true, "Please provide a url"],
		validate: {
			validator: validateUrl,
			message: () => "Please provide a valid URL",
		},
	},
	rating: {
		type: Number,
		required: [true, "The rating must be a number"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const model = mongoose.model("Bookmark", schema);

module.exports = model;
