const fs = require("fs/promises");
const path = require("path");

async function getLatestReport() {

    const reportPath = path.join(
        __dirname,
        "..",
        "results",
        "analysis.json"
    );

    const report = await fs.readFile(reportPath, "utf8");

    return JSON.parse(report);
}

module.exports = {
    getLatestReport
};