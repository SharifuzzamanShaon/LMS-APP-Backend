const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    
  },
  { timestamps: true }
);
const OrderModel = mongoose.model("orderModel", orderSchema);
module.exports = OrderModel;
