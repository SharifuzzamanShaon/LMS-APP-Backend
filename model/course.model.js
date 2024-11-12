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
    // required: true,
  },
  videoUrl: {
    type: String,
    // required: true,
  },
  videoThumbnail: {
    type: String,
    // required: true,
  },
  videoSection: {
    type: String,
    // required: true,
  },
  videoLength: {
    type: Number,
    // required: true,
  },
  videoPlayer: {
    type: String,
    // required: true,
  },
  links: {
    type: String,
  },
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
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
      //   required: true,
    },
    url: {
      type: String,
    },
  },
  tags: [String],
  level: {
    type: [String],
    enum: ["beginner", "intermediate", "advance", "XL"],
    required: true,
  },
  demoUrl: {},
  benefits: [{ title: String }],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  purchased:Number,
  ratings: {
    type: Number,
    default: 0,
  },
});

const CourseModel = mongoose.model("CourseModel", courseSchema);
module.exports = { CourseModel };
