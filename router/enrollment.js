const express = require("express");
const { makePayment, enrollUser } = require("../controller/payment");
const router = express.Router();

router.post("/makePayment", makePayment)
router.post("/enroll", enrollUser)
module.exports = router