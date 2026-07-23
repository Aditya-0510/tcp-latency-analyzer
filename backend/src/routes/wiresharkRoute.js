const express = require("express");

const router = express.Router();

const {
    openPacket
} = require("../controllers/wiresharkController");

router.post("/open", openPacket);

module.exports = router;