const express = require("express");
const multer = require("multer");
const {
	postQueryWithImage,
	postQueryWithoutImage,
} = require("../controllers/llmController");
const router = express.Router();

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "uploads/");
		},
		filename: function (req, file, cb) {
			const ext = file.mimetype.split("/")[1];
			cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
		},
	}),
	fileFilter: function (req, file, cb) {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only images are allowed"));
		}
	},
});

router.post("/queryWithImage", upload.single("image"), postQueryWithImage);

router.get("/", postQueryWithoutImage);

module.exports = router;
