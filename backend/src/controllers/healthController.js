const health = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running"
    });
};

module.exports = {
    health
};