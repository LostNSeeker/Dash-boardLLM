const express = require('express');
const { verifyUser } = require('../controllers/authController');
const router = express.Router();

router.post('/verify', verifyUser);

module.exports = router;
