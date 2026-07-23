const openPacket = async (req, res) => {

    res.json({
        success: true,
        message: "Open Wireshark endpoint"
    });

};

module.exports = {
    openPacket
};