require("dotenv").config();

module.exports = {
    port: process.env.PORT || 5000,
    analyzerPath: process.env.ANALYZER_PATH,
    wiresharkPath: process.env.WIRESHARK_PATH,
    uploadDir: "src/uploads",
    resultDir: "src/results"
};