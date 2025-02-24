const { userUpdate, userDelete, updateAvatar } = require("../controller/user");
const authMiddleware = require("../middleware/authenticate/authMiddleware");
const { enrolledCourses } = require("../controller/courseController");
const router = require("express").Router();

router.put("/update/:id", authMiddleware, userUpdate);
router.patch("/upldate-avatar", authMiddleware, updateAvatar)
router.delete("/delete/:id", authMiddleware, userDelete);
router.get("/enrolled-courses", authMiddleware, enrolledCourses);

module.exports = router;
