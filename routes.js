const express = require("express");
var fs = require('fs');
const router = express.Router();

// Home
router.get("/", async function(req, res) {
  res.render("\home.pug");
});

module.exports = router;
