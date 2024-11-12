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
    payment_info: {
      type: Object,
    },
  },
  { timestamps: true }
);
const OrderModel = mongoose.model("orderModel", orderSchema);
module.exports = OrderModel;
