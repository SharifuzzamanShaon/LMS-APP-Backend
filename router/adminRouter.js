const express = require("express");
const router = express.Router();
const { adminDashboardInfo } = require("../controller/adminController/adminDashboard");

router.get("/dashboard", adminDashboardInfo)

module.exports = router