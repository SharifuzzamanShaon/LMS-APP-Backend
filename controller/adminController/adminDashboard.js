const Enrollment = require("../../model/enrollModel");
const User = require("../../model/user.model");
const OrderModel = require("../../model/order.model");
const { CourseModel } = require("../../model/course.model");
const adminDashboardInfo = async (req, res, next) => {
  try {
    const publishedCourse = await Enrollment.countDocuments();
    const totalUser = await User.countDocuments();
    const totalEnrollement = await Enrollment.countDocuments();
    const totalOrder = await OrderModel.aggregate([
      {
        $match: {
          payment_status: "paid",
        },
      },
    ]);
    const totalRevenue = totalOrder.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );
    console.log(publishedCourse);
    return res
      .status(200)
      .send({ publishedCourse, totalUser, totalEnrollement, totalRevenue });
  } catch (error) {
    next(error);
  }
};

const studentList = async (req, res, next) => {
  try {
    const students = await User.find({ role: "user" }).select(
      "name username _id email avatar regCourses"
    );
    return res.status(200).json({ success: true, students });
  } catch (error) {
    next(error);
  }
};

const courseList = async (req, res, next) => {
  try {
    const courses = await CourseModel.find().select("name thumbnail price tags level _id");
    return res.status(200).json({ success: true, courses });
  } catch (error) { 
    next(error);
  }
};

module.exports = {
  adminDashboardInfo,
  studentList,
  courseList
};
