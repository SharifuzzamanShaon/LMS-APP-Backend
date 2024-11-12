const { createOrder } = require("../controller/orderController");
const authMiddleware = require("../middleware/authenticate/authMiddleware");

const router = require("express").Router();

router.post("/create-order", authMiddleware, createOrder);

module.exports = router;
