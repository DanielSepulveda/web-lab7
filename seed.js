require("dotenv").config();
const seeder = require("mongoose-seed");

seeder.connect(process.env.DB_URL, () => {
	seeder.loadModels(["./models/bookmarks"]);

	seeder.clearModels(["Bookmark"]);

	seeder.populateModels(data, (err, done) => {
		if (err) {
			console.log("Error while seeding");
		}
		if (done) {
			console.log("Seeding done");
		}

		seeder.disconnect();
	});
});

const data = [
	{
		model: "Bookmark",
		documents: [
			{
				_id: "ddf20f06-60be-420d-b78b-63c4e67c3cf9",
				title: "Google",
				description: "Google site",
				url: "https://google.com",
				rating: 5,
			},
			{
				_id: "640922c8-5a1c-4905-ad5a-68eb9d0423fb",
				title: "Facebook",
				description: "Facebook page",
				url: "https://facebook.com",
				rating: 4,
			},
		],
	},
];
