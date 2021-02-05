const express = require("express");
const router = express.Router();
const Bookmarks = require("../models/bookmarks.models");

//READ
router.get("/", (req, res) => {
  Bookmarks.find({}, (err, foundBookmarks) => {
    res.json(foundBookmarks);
  });
});

//CREATE
router.post("/", (req, res) => {
  Bookmarks.create(req.body, (err, createdBookmark) => {
    res.json(createdBookmark);
  });
});

//UPDATE
router.put("/:id", (req, res) => {
  Bookmarks.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedBookmark) => {
      res.json(updatedBookmark);
    }
  );
});

//DELETE
router.delete("/:id", (req, res) => {
  Bookmarks.findByIdAndRemove(req.params.id, (err, deletedBookmark) => {
    res.json(deletedBookmark);
  });
});

module.exports = router;
