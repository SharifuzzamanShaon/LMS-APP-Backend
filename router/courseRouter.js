const {
  uploadCourse,
  editCourse,
  getSingleCourse,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReview,
  viewAllCourses,
  searchCourse,
} = require("../controller/courseController");
const authMiddleware = require("../middleware/authenticate/authMiddleware");
const router = require("express").Router();

router.post("/create", uploadCourse);
router.patch("/edit-course/:courseId", editCourse);
router.get("/get-course/:courseId", getSingleCourse);
router.get("/view-all-course", viewAllCourses)
router.get("/search", searchCourse)
router.get("/get-course-content/:id", authMiddleware, getCourseByUser);
router.put("/add-question", authMiddleware, addQuestion);
router.put("/add-answer", authMiddleware, addAnswer);
router.put("/add-review", authMiddleware, addReview);
module.exports = router;
