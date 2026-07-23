const express = require("express");

const router = express.Router();

router.use("/health", require("./healthRoute"));
router.use("/analyze", require("./analyzeRoute"));
router.use("/wireshark", require("./wiresharkRoute"));

module.exports = router;