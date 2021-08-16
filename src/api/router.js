const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    service_name: "Telegaram",
    version: "0.0.1",
  });
});

module.exports = router;
