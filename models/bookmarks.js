const _ = require("lodash");
const v4 = require("uuid").v4;

const schema = require("./bookmarks.schema");
const seed = require("./bookmarks.seed.json");

const bookmarks = () => {
	const bookmarks = seed;
	return {
		save: (bookmark) => {
			if (schema.isValidSync(bookmark)) {
				bookmark.id = v4();
				bookmarks.push(bookmark);
			}
		},
		find: (params = {}) => {
			return _.filter(bookmarks, params);
		},
		findOne: (params = {}) => {
			return _.find(bookmarks, params);
		},
		validate: (values, options = {}) => {
			const validateResponse = schema.validateSync(values, options);
			return validateResponse;
		},
		delete: (params) => {
			return _.remove(bookmarks, params);
		},
		update: (id, values) => {
			return Object.assign(_.find(bookmarks, { id }), values);
		},
	};
};

module.exports = bookmarks();
