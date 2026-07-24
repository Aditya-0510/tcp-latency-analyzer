const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const openPacket = async (req, res) => {
    try {
        const packetNumber = req.body?.packetNumber;

        if (!packetNumber) {
            return res.status(400).json({
                success: false,
                message: "Packet number is required.",
            });
        }

        const wiresharkPath = process.env.WIRESHARK_PATH;

        if (!wiresharkPath || !fs.existsSync(wiresharkPath)) {
            return res.status(500).json({
                success: false,
                message: "Wireshark executable not found.",
            });
        }

        const uploadsDir = path.join(__dirname, "..", "uploads");
        console.log("Uploads dir:", uploadsDir);
        console.log("Exists:", fs.existsSync(uploadsDir));
        console.log("Files:", fs.readdirSync(uploadsDir));

        if (!fs.existsSync(uploadsDir)) {
            return res.status(404).json({
                success: false,
                message: "Uploads directory not found.",
            });
        }

        const pcapFiles = fs.readdirSync(uploadsDir).filter(file => {
            const ext = path.extname(file).toLowerCase();
            return [".pcap", ".pcapng"].includes(ext);
        });

        if (pcapFiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No PCAP file found.",
            });
        }

        // Latest uploaded capture
        const latestPcap = pcapFiles
            .map(file => ({
                file,
                time: fs.statSync(path.join(uploadsDir, file)).mtimeMs,
            }))
            .sort((a, b) => b.time - a.time)[0];

        const pcapPath = path.join(uploadsDir, latestPcap.file);

        console.log("Opening:", pcapPath);
        console.log("Packet:", packetNumber);

        const wireshark = spawn(
            wiresharkPath,
            [
                "-r",
                pcapPath,
                "-g",
                packetNumber.toString(),
            ],
            {
                detached: true,
                stdio: "ignore",
                windowsHide: false,
            }
        );

        wireshark.unref();

        return res.json({
            success: true,
            message: "Wireshark launched.",
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    openPacket,
};