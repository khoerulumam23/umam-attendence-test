const db = require("../models/index");
const moment = require('moment-timezone');

const record = async (req, res) => {
    const { location, ip_address } = req.body;
    const photo_url = req.file ? req.file.path : null;
    const user_id = req.user.id;

    try {
        await db.Attendance.create({
            user_id,
            location,
            ip_address,
            photo_url,
        });

        return res.status(201).json({
            success: true,
            message: 'Attendance recorded successfully!',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to record attendance',
            error: err.message,
        });
    }
}

const report = async (req, res) => {
    const { timezone } = req.query;
    const user_id = req.user.id;

    try {
        const attendance = await db.Attendance.findAll({
            where: { user_id }
        });

        const formattedAttendance = attendance.map(record => {
            const localTime = moment.tz(record.timestamp, timezone).format();
            return {
                id: record.id,
                user_id: record.user_id,
                location: record.location,
                ip_address: record.ip_address,
                photo_url: record.photo_url,
                timestamp: record.timestamp,
                localTime: localTime,
            };
        });

        return res.status(200).json({
            success: true,
            data: formattedAttendance,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to generate report',
            error: err.message,
        });
    }
};


module.exports = {
    record,
    report
}