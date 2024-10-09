const express = require('express');
const { record, report } = require('../controllers/attendance.controller');
const authenticateJWT = require('../middlewares/auth');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.get('/report', authenticateJWT, report);
router.post('/record', authenticateJWT, upload.single('photo'), record);

module.exports = router;