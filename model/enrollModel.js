const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  sessionId: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  amount: { type: Number, required: true },
  enrolledAt: { type: Date, default: Date.now },  // Enrollment timestamp
  status: { type: String, enum: ["active", "completed", "canceled"], default: "active" } // Tracking progress
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
