const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  // method 1 (preferred)
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  // method 2
  // res.sendFile("./views/index.html", { root: __dirname });
});
// new-page
router.get("/new-page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});
// old-page redirect
router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // 302 by default
});

module.exports = router;
router;
