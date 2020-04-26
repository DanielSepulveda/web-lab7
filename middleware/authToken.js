const authToken = () => {
	const superSecretToken = "2abbf7c3-245b-404f-9473-ade729ed4653";

	return (req, res, next) => {
		let isTokenValid = false;

		const bearerToken = req.headers.authorization;

		if (bearerToken) {
			if (bearerToken !== `Bearer ${superSecretToken}`) {
				res.statusMessage = "Please provide a valid Bearer Authorization token";

				return res.status(401).end();
			} else {
				isTokenValid = true;
			}
		}

		const bookApiKey = req.headers["book-api-key"];

		if (bookApiKey) {
			if (bookApiKey !== superSecretToken) {
				res.statusMessage = "Please provide a valid Header Authorization token";

				return res.status(401).end();
			} else {
				isTokenValid = true;
			}
		}

		const apiKey = req.query.apiKey;

		if (apiKey) {
			if (apiKey !== superSecretToken) {
				res.statusMessage = "Please provide a valid Query Authorization token";

				return res.status(401).end();
			} else {
				isTokenValid = true;
			}
		}

		if (!isTokenValid) {
			res.statusMessage =
				"Please provide an Authorization token bia any supported methods";

			return res.status(401).end();
		} else {
			next();
		}
	};
};

module.exports = authToken();
