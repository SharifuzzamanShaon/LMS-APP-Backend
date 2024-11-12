const { CourseModel } = require("../model/course.model");
const User = require("../model/user.model");
const createNewOrder = require("../services/order.services");
const { error } = require("../utils/error");
const getOrderId = require("../utils/generateOrderId");
const path = require("path");
const ejs = require("ejs");
const sendEmail = require("../utils/sendEmail");
const OrderModel = require("../model/order.model");
const notificationModel = require("../model/notificationModel");

const createOrder = async (req, res, next) => {
  try {
    const { courseId, payment_info } = req.body;
    let user = await User.findById(req.user?._id);
    const coursedExistInUser = user?.regCourses.some(
      (item) => item._id.toString() === courseId
    );

    if (coursedExistInUser) {
      throw error("already enrolled in this course", 400);
    }
    let course = await CourseModel.findById(courseId);
    if (!course) {
      throw error("cousrs do not exists", 404);
    }
    const orderData = {
      courseId: course._id,
      userId: user?._id,
    };
    // await OrderModel.create(orderData);

    const orderId = getOrderId(4);
    const mailData = {
      orderId,
      username: user.username,
      name: course.name,
      price: course.price,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const filePath = path.join(__dirname, "../views/mail/confirmOrder.ejs");
    await ejs.renderFile(filePath, mailData, (err, str) => {
      if (err) {
        return res.status(500).send("Error rendering template");
      }
      sendEmail(`${user.email}`, "Activate Your Account", str);
    });
    if (course.purchased) {
      course.purchased += 1;
    }
    user?.regCourses.push({ _id: course._id });
    await user.save();
    await notificationModel.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new order from ${course?.name}`,
    });
    createNewOrder(orderData, res);
  } catch (error) {
    next(error);
  }
};
module.exports = { createOrder };
