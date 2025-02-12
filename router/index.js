const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const authRouter = require("./auth");
const courseRouter = require("./courseRouter");
const orderRouter = require("./orderRouter");
const accessProfile = require("./profileRouter");
const productRouter = require("./ProductRouter");
const categoryRouter = require("./CategoryRouter");
const conversationRouters = require("./ConversationRouters/conversationRouter");
const registerCourseRouter = require("./registerCourseRouter")
const authMiddleware = require("../middleware/authenticate/authMiddleware");
const enrollment = require("./enrollment");
const authorizedUser = require("../middleware/authorize/authorizedUser");
const adminRouter = require("./adminRouter")
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/profile", authMiddleware, accessProfile);
router.use("/course", courseRouter);
router.use("/register-course", registerCourseRouter);
router.use("/order", orderRouter);
router.use("/products", productRouter);
router.use("/product/category", categoryRouter);
router.use("/conversation", authMiddleware, conversationRouters);
router.use("/enroll-course", authMiddleware,  enrollment)

//admin router
router.use("/admin", adminRouter)
module.exports = router;
