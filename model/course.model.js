const { default: mongoose } = require("mongoose");

const questionSchema = new mongoose.Schema({
  user: Object,
  question: String,
  questionReplies: [Object],
});
const reviewSchema = new mongoose.Schema({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  reviews: String,
});
const courseDataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  sectionContents: [
    {
      videoUrl: {
        type: String,
      },
      videoTitle: {
        type: String,
      },
      paid: {
        type: Boolean,
        default: true,
      },
    },
  ],
  questions: [questionSchema],
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    url: {
      type: String,
      //   required: true,
    },
  },
  tags: [String],
  level: {
    type: [String],
    enum: ["beginner", "intermediate", "advance"],
    required: true,
  },
  benefits: [],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  purchased: Number,
  ratings: {
    type: Number,
    default: 0,
  },
});

const CourseModel = mongoose.model("CourseModel", courseSchema);
module.exports = { CourseModel };
