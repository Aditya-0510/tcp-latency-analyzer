const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);

        cb(null, `${timestamp}${extension}`);
    }
});

module.exports = multer({
    storage,

    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (extension !== ".pcap" && extension !== ".pcapng") {
            return cb(new Error("Only .pcap and .pcapng files are allowed."));
        }

        cb(null, true);
    }
});