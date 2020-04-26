const yup = require("yup");

const schema = yup.object().shape({
	id: yup.string(),
	title: yup
		.string("The title must be a string.")
		.required("Please provide a title."),
	description: yup
		.string("The description must be a string")
		.required("Please provide a description."),
	url: yup
		.string("The url must be a string.")
		.url("Please provide a valid url.")
		.required("Please provide a url."),
	rating: yup
		.number("The rating must be a number")
		.required("Please provide a valid rating."),
});

module.exports = schema;
