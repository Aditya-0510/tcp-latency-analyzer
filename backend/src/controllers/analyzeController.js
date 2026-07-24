const analyzerService = require("../services/analyzerService");
const reportService = require("../services/reportService");

const analyze = async (req, res, next) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PCAP file uploaded."
            });
        }

        await analyzerService.runAnalyzer(req.file.path);

        const report = await reportService.getLatestReport();
        report.captureFile = req.file.filename;
        
        res.status(200).json({
            success: true,
            report
        });

    }
    catch (error) {
        next(error);
    }

};

const getReport = async (req, res, next) => {

    try {

        const report = await reportService.getLatestReport();

        res.status(200).json({
            success: true,
            report
        });

    }
    catch (error) {
        next(error);
    }

};

module.exports = {
    analyze,
    getReport
};