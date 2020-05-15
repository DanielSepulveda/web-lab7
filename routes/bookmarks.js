const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const Bookmark = require("../models/bookmark");
const BookmarkController = require("../controllers/bookmark");

const router = express.Router();
const jsonParser = bodyParser.json();

console.log("BOOKMARKS");

router.get("/bookmarks", BookmarkController.bookmarks_list);
router.get("/bookmark", BookmarkController.bookmark_by_title);
router.post("/bookmarks", jsonParser, BookmarkController.create_bookmark);
router.delete("/bookmark/:id", BookmarkController.delete_bookmark);
router.patch("/bookmark/:id", jsonParser, BookmarkController.update_bookmark);

module.exports = router;
