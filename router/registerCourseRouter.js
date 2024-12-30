const { registerToCourse } = require("../controller/courseRegController/registerCourse")

const router = require("express").Router()

router.post("/", registerToCourse);

module.exports = router
