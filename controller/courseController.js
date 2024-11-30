const { default: mongoose } = require("mongoose");
const { redis } = require("../DB/redis");
const { CourseModel } = require("../model/course.model");
const { error } = require("../utils/error");
const { uploadOnCloudinary } = require("../utils/FileUpload");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const sendEmail = require("../utils/sendEmail");

const uploadCourse = async (req, res, next) => {
  try {
    let data = req.body;
    console.log(data);

    const base64Image = data.thumbnail;
    if (base64Image) {
      const buffer = Buffer.from(base64Image, "base64");
      fs.writeFileSync("outputfile", buffer);
      const response = await uploadOnCloudinary(base64Image);
      data.thumbnail = {
        public_id: response.url,
        url: response.secure_url,
      };
    }
    const course = await CourseModel.create(data);
    res.status(200).send({ success: true, course });
  } catch (error) {
    next(error);
  }
};
const editCourse = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.courseId;
    const base64Image = data.thumbnail;
    if (base64Image) {
      const buffer = Buffer.from(base64Image, "base64");
      fs.writeFileSync("outputfile", buffer);
      const response = await uploadOnCloudinary(base64Image);
      data.thumbnail = {
        public_id: response.url,
        url: response.secure_url,
      };
    } else {
      data.thumbnail;
    }
    const course = await CourseModel.findByIdAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).send({ success: true, course });
  } catch (error) {
    next(error);
  }
};
//Without purchas
const getSingleCourse = async (req, res, next) => {
  try {
    const id = req.params.courseId;
    const isCacheExist = await redis.get(id);
    if (isCacheExist) {
      res.status(200).send({ success: true, isCacheExist });
    } else {
      const course = await CourseModel.findById({ _id: id }).select(
        "-courseData.videoUrl -courseData.courseData -courseData.questions -courseData.links"
      );
      res.status(200).send({ success: true, course });
      await redis.set(id, course);
    }
  } catch (error) {
    next(error);
  }
};
const viewAllCourses = async (req, res, next) => {
  try {
    const allCourses = await CourseModel.find().select('name description _id');
    res.status(200).send({success:true, allCourses})
  } catch (error) {
    next(error);
  }
};
//By varified user
const getCourseByUser = async (req, res, next) => {
  try {
    let courseId = req.params.id;
    const userCourseList = req.user?.regCourses;
    const courseExist = userCourseList.find((item) => item._id === courseId);
    if (!courseExist) {
      throw error("Not elegible for access this course", 403);
    } else {
      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(200).send({ success: true, content });
    }
  } catch (error) {
    next(error);
  }
};
const addQuestion = async (req, res, next) => {
  try {
    const { question, courseId, contentId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      throw error("invalid content id", 400);
    }
    console.log(course);

    const courseContent = course.courseData?.find((item) =>
      item._id.equals(contentId)
    );
    if (!courseContent) {
      throw error("invalid content id", 400);
    }
    const newQuestion = {
      user: req.user,
      question,
      questionReplies: [],
    };
    courseContent.questions.push(newQuestion);
    await course?.save();
    res.status(200).send({ success: true, course });
  } catch (error) {
    next(error);
  }
};
const addAnswer = async (req, res, next) => {
  try {
    const { answer, courseId, contentId, questionId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      throw error("invalid course id", 400);
    }
    const courseContent = course.courseData?.find((item) =>
      item._id.equals(contentId)
    );
    if (!courseContent) {
      throw error("invalid content id", 400);
    }
    const questionContent = courseContent.questions?.find((item) =>
      item._id.equals(questionId)
    );
    if (!questionContent) {
      throw error("invaild question id", 400);
    }
    const newAnswer = {
      repliedBy: req.user,
      answer,
    };
    questionContent.questionReplies.push(newAnswer);
    await course?.save();

    const filePath = path.join(__dirname, "../views/mail/replyQuestion.ejs");
    const data = {
      name: questionContent.user.username,
    };
    await ejs.renderFile(filePath, data, (err, str) => {
      if (err) {
        return res.status(500).send("Error rendering template");
      }
      sendEmail(`${questionContent.user.email}`, "Reply your ans", str);
    });
    res.status(200).send({ success: true, course });
  } catch (error) {
    next(error);
  }
};
const addReview = async (req, res, next) => {
  try {
    const { reviews, rating, courseId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw error("invalid course id", 400);
    }
    const newReview = {
      user: req.user,
      rating,
      reviews,
    };
    course.reviews.push(newReview);
    let avg = 0;
    course.reviews.forEach((rev) => (avg += rev.rating));
    if (course) {
      course.ratings = avg / course.reviews.length;
    }
    await course?.save();
    res.status(200).send({ success: true, course });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  uploadCourse,
  editCourse,
  getSingleCourse,
  viewAllCourses,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReview,
};
