const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "src/uploads",

    filename: (req, file, cb) => {
        const filename =
            Date.now() + path.extname(file.originalname);

        cb(null, filename);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if (ext !== ".pcap" && ext !== ".pcapng") {
            return cb(new Error("Only PCAP files are allowed"));
        }

        cb(null, true);
    }
});

module.exports = upload;