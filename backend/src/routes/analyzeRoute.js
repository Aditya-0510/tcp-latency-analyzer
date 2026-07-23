const express = require("express");

const router = express.Router();

const {
    analyze,
    getReport
} = require("../controllers/analyzeController");

const uploadMiddleware = require("../middleware/uploadMiddleware");

router.post("/", uploadMiddleware.single("pcap"), analyze);

router.get("/report", getReport);

module.exports = router;