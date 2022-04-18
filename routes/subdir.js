const express = require("express");
const router = express.Router();
const path = require("path");

app.get("^/$|/index(.html)?", (req, res) => {
  // method 1 (preferred)
  res.sendFile(path.join(__dirname, "views", "index.html"));
  // method 2
  // res.sendFile("./views/index.html", { root: __dirname });
});

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});

router.get("^/$|/test(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});

module.exports = router;
