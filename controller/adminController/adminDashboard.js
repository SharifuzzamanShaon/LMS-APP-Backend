const { CourseModel } = require("../../model/course.model");

const adminDashboardInfo = async (req, res, next) => {
  try {
    const publishedCourse = await CourseModel.countDocuments()
    // const totalEnrollement = await
    console.log(publishedCourse);
    return res.status(200).send(publishedCourse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminDashboardInfo,
};
