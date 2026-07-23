const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs/promises");

async function runAnalyzer(pcapPath) {
    const analyzerPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "analyzer",
        "build",
        "tcp_latency.exe"
    );

    const resultsDir = path.join(
        __dirname,
        "..",
        "results"
    );

    await fs.mkdir(resultsDir, { recursive: true });

    const outputPath = path.join(
        resultsDir,
        "analysis.json"
    );

    return new Promise((resolve, reject) => {
        const analyzer = spawn(analyzerPath, [
            pcapPath,
            outputPath
        ]);

        let stdout = "";
        let stderr = "";

        analyzer.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        analyzer.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        analyzer.on("error", (err) => {
            reject(new Error(`Failed to start analyzer: ${err.message}`));
        });

        analyzer.on("close", (code) => {
            if (code !== 0) {
                return reject(
                    new Error(
                        `Analyzer exited with code ${code}\n${stderr}`
                    )
                );
            }

            console.log(stdout);

            resolve(outputPath);
        });
    });
}

module.exports = {
    runAnalyzer,
};