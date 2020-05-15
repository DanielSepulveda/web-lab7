const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

const tableRow = ({ description, rating, title, url, _id }) => `
  <tr>
    <td class="border-t border-b border-l px-4 py-2">${title}</td>
    <td class="border-t border-b px-4 py-2"><a href="${url}" class="text-blue-400 hover:underline" target="_blank" rel="noopener">${url}</a></td>
    <td class="border-t border-b px-4 py-2">${description}</td>
    <td class="border-t border-b px-4 py-2">${rating}</td>
    <td class="border-t border-b px-4 py-2"><span class="emoji cursor-pointer" id="deleteBookmark" data-id="${_id}">❌</span></td>
    <td class="border-t border-b border-r px-4 py-2"><span class="emoji cursor-pointer" id="editBookmark" data-id="${_id}">📝</span></td>
  </tr>
`;

const bookmarksCache = {};

const fetchBookmarks = () => {
	let bookmarksTable = document.querySelector("#tableBody");

	bookmarksTable.innerHTML = "";

	document.querySelector(".loader-state").style.display = "flex";
	document.querySelector("table").style.display = "none";
	document.querySelector(".empty-state").style.display = "none";

	fetch("/bookmarks/", {
		headers: {
			Authorization: `Bearer ${API_TOKEN}`,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			document.querySelector(".loader-state").style.display = "none";
			if (data.length) {
				document.querySelector("table").style.display = "table";
				data.forEach((bookmark) => {
					bookmarksTable.innerHTML += tableRow(bookmark);
					bookmarksCache[bookmark._id] = bookmark;
				});
			} else {
				document.querySelector(".empty-state").style.display = "flex";
				openErrorModal(e.message);
			}
		});
};

const addBookmark = () => {
	let bookmarksTable = document.querySelector("#tableBody");
	document.querySelector("#addBookmark").addEventListener("submit", (e) => {
		e.preventDefault();

		const title = document.querySelector("#title").value;
		const url = document.querySelector("#url").value;
		const desc = document.querySelector("#desc").value;
		const rating = document.querySelector("#rating").value;

		const data = {
			title,
			url,
			description: desc,
			rating: Number(rating),
		};

		fetch("/bookmarks/", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.ok) return response.json();
				throw new Error(response.statusText);
			})
			.then((data) => {
				bookmarksCache[data._id] = data;
				document.querySelector("table").style.display = "table";
				document.querySelector(".empty-state").style.display = "none";
				bookmarksTable.innerHTML = tableRow(data) + bookmarksTable.innerHTML;
				document.querySelector("#addBookmark").reset();
				openSnack("Bookmark Created", "👍");
			})
			.catch((e) => {
				openErrorModal(e.message);
			});
	});
};

const deleteBookmark = () => {
	document.querySelector("#tableBody").addEventListener("click", (e) => {
		if (e.target.matches("#deleteBookmark")) {
			const bookmarkId = e.target.dataset.id;
			fetch(`/bookmark/${bookmarkId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${API_TOKEN}`,
				},
			})
				.then((response) => {
					if (response.ok) {
						openSnack("Bookmark deleted", "👌");
						return fetchBookmarks();
					}
					throw new Error(response.statusText);
				})
				.catch((e) => {
					openErrorModal(e.message);
				});
		}
	});
};

const searchBookmark = () => {
	let bookmarksTable = document.querySelector("#tableBody");
	document.querySelector("#searchBookmark").addEventListener("submit", (e) => {
		e.preventDefault();

		bookmarksTable.innerHTML = "";

		document.querySelector(".loader-state").style.display = "flex";
		document.querySelector("table").style.display = "none";
		document.querySelector(".empty-state").style.display = "none";

		const search = document.querySelector("#search").value;

		fetch(`/bookmark?title=${search}`, {
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
			},
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error(response.statusText);
			})
			.then((data) => {
				document.querySelector(".loader-state").style.display = "none";
				if (data.length) {
					document.querySelector("table").style.display = "table";
					data.forEach((bookmark) => {
						bookmarksTable.innerHTML += tableRow(bookmark);
					});
				} else {
					document.querySelector(".empty-state").style.display = "flex";
				}
			})
			.catch((e) => {
				document.querySelector(".loader-state").style.display = "none";
				openErrorModal(e.message);
			});
	});
};

const resetSearch = () => {
	document.querySelector("#resetSearch").addEventListener("click", () => {
		fetchBookmarks();
	});
};

const openEditModal = () => {
	document.querySelector("#tableBody").addEventListener("click", (e) => {
		if (e.target.matches("#editBookmark")) {
			const bookmarkId = e.target.dataset.id;
			const bookmark = bookmarksCache[bookmarkId];

			document.querySelector("#modalTitle").innerHTML = "Edit Bookmark";
			document.querySelector("#editBookmarkForm").style.display = "block";
			document.querySelector("#modalError").style.display = "none";

			document.querySelector("#editBookmarkForm").dataset.editId = bookmark._id;
			document.querySelector("#editTitle").value = bookmark.title;
			document.querySelector("#editUrl").value = bookmark.url;
			document.querySelector("#editDesc").value = bookmark.description;
			document.querySelector("#editRating").value = bookmark.rating;

			const body = document.querySelector("body");
			const modal = document.querySelector(".modal");
			modal.classList.remove("opacity-0");
			modal.classList.remove("pointer-events-none");
			body.classList.add("modal-active");
		}
	});
};

const openErrorModal = (errorMessage) => {
	document.querySelector("#modalTitle").innerHTML = "Error";
	document.querySelector("#editBookmarkForm").style.display = "none";
	document.querySelector("#modalError").style.display = "block";

	document.querySelector("#modalError p").innerHTML = errorMessage;

	const body = document.querySelector("body");
	const modal = document.querySelector(".modal");
	modal.classList.remove("opacity-0");
	modal.classList.remove("pointer-events-none");
	body.classList.add("modal-active");
};

const closeModal = () => {
	const body = document.querySelector("body");
	const modal = document.querySelector(".modal");
	modal.classList.add("opacity-0");
	modal.classList.add("pointer-events-none");
	body.classList.remove("modal-active");

	document.querySelector("#editTitle").value = "";
	document.querySelector("#editUrl").value = "";
	document.querySelector("#editDesc").value = "";
	document.querySelector("#editRating").value = "";

	document.querySelector("#modalTitle").innerHTML = "";
	document.querySelector("#editBookmarkForm").style.display = "none";
	document.querySelector("#modalError").style.display = "none";

	document.querySelector("#modalError p").innerHTML = "";
};

const editBookmark = () => {
	document
		.querySelector("#editBookmarkForm")
		.addEventListener("submit", (e) => {
			e.preventDefault();

			const bookmarkId = document.querySelector("#editBookmarkForm").dataset
				.editId;
			const title = document.querySelector("#editTitle").value;
			const url = document.querySelector("#editUrl").value;
			const desc = document.querySelector("#editDesc").value;
			const rating = document.querySelector("#editRating").value;

			const data = {
				id: bookmarkId,
				update: {
					title,
					url,
					description: desc,
					rating: Number(rating),
				},
			};

			fetch(`/bookmark/${bookmarkId}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${API_TOKEN}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(data),
			})
				.then((response) => {
					if (response.ok) return response.json();
					throw new Error(response.statusText);
				})
				.then((data) => {
					openSnack("Bookmark edited", "🤙");
					fetchBookmarks();
					closeModal();
				})
				.catch((e) => {
					console.log(e);
				});
		});
};

const modalConfig = () => {
	const overlay = document.querySelector(".modal-overlay");
	overlay.addEventListener("click", closeModal);

	const closemodal = document.querySelectorAll(".modal-close");
	closemodal.forEach((el) => {
		el.addEventListener("click", closeModal);
	});

	document.onkeydown = function (evt) {
		evt = evt || window.event;
		var isEscape = false;
		if ("key" in evt) {
			isEscape = evt.key === "Escape" || evt.key === "Esc";
		} else {
			isEscape = evt.keyCode === 27;
		}
		if (isEscape && document.body.classList.contains("modal-active")) {
			closeModal();
		}
	};
};

const openSnack = (message, emoji, status = "positive") => {
	const snackContent = `${message} <span class="emoji ml-2" data-snack="emoji">${emoji}</span>`;
	document.querySelector('[data-snack="title"]').innerHTML = snackContent;
	document.querySelector(".snack").classList.add(status, "show");
	setTimeout(() => {
		document.querySelector(".snack").classList.remove("show");
	}, 2800);
};

const init = () => {
	fetchBookmarks();
	addBookmark();
	deleteBookmark();
	searchBookmark();
	resetSearch();
	modalConfig();
	openEditModal();
	editBookmark();
};

window.onload = init;
