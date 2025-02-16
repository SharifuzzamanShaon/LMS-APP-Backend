const express = require("express");
const router = express.Router();
const { adminDashboardInfo , studentList, courseList} = require("../controller/adminController/adminDashboard");

router.get("/dashboard", adminDashboardInfo)
router.get("/students", studentList)
router.get("/courses", courseList)
module.exports = router