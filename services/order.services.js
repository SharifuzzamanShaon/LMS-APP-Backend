const OrderModel = require("../model/order.model");

const createNewOrder = async (data, res) => {
  const order = await OrderModel.create(data);
  res
    .status(200)
    .send({ success: true, message: "successfully enrolled", order });
};
module.exports = createNewOrder;
