const express = require("express");
const { makePayment, enrollUser } = require("../controller/payment");
const router = express.Router();
const authMiddleware = require("../middleware/authenticate/authMiddleware");
router.post("/makePayment", authMiddleware, makePayment)
router.post("/enroll", authMiddleware, enrollUser)
module.exports = router