const express = require('express');
const { registerUser, signInUser, updateProfile } = require('../controllers/auth.controller');
const authenticateJWT = require('../middlewares/auth');
const router = express.Router();

router.post('/sign-up', registerUser);
router.post('/sign-in', signInUser);
router.put('/update-profile', authenticateJWT, updateProfile);

module.exports = router;