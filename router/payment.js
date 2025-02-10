const express = require("express");
const { makePayment } = require("../controller/payment");
const router = express.Router();

router.post("/makePayment", makePayment)

module.exports = router