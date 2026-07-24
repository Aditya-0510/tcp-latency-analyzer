const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const openPacket = async (req, res) => {
    try {
        const { packetNumber, captureFile } = req.body;

        if (!packetNumber) {
            return res.status(400).json({
                success: false,
                message: "Packet number is required.",
            });
        }

        if (!captureFile) {
            return res.status(400).json({
                success: false,
                message: "Capture file is required.",
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
        const pcapPath = path.join(uploadsDir, captureFile);

        if (!fs.existsSync(pcapPath)) {
            return res.status(404).json({
                success: false,
                message: "Capture file not found.",
            });
        }

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

        return res.status(200).json({
            success: true,
            message: `Opened packet ${packetNumber} in Wireshark.`,
            captureFile
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    openPacket,
};