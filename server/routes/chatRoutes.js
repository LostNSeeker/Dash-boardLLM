const express = require('express');
const multer = require('multer');
const { postQueryWithImage } = require('../controllers/llmController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/queryWithImage', upload.single('image'), postQueryWithImage);

module.exports = router;
