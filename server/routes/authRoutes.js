const express = require("express");
const {
	verifyAndSaveUser,
	verifyUser,
	getUser,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", verifyAndSaveUser);
router.post("/login", verifyUser);

router.post("/getUser", getUser);

module.exports = router;
