const Enrollment = require("../model/enrollModel");
const OrderModel = require("../model/order.model");
const UserModel = require("../model/user.model");
const stripe = require("stripe")(
  "sk_test_51Qq6EcK5LodKUJLl0HG1snEOb78wvVIY70sNfQgkI5GTmTRZWqNcRhRRmXA0XGOCXgdWqNdxk26e4dzC09xbOQd800HodFA48a"
);
const makePayment = async (req, res, next) => {
  try {
    const course = req.body;
    const price = parseFloat(course.price);
    if (isNaN(price)) {
      throw new Error("Invalid course price. Price must be a valid number.");
    }
    const priceInCents = Math.round(price * 100);
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.name,
          },
          unit_amount: course.price * 100, // Use the calculated price in cents
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `http://localhost:3000/payment/success?courseId=${course.id}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/payment/cancel`,
    });
    console.log(session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    next(error);
  }
};

const enrollUser = async (req, res, next) => {
  try {
    const { sessionId, courseId } = req.body;
    if (!sessionId || !courseId) {
      return res.status(400).send({
        success: false,
        message: "Session ID and course ID are required.",
      });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Add validation checks for the session
    if (
      !session ||
      session.payment_status !== "paid" ||
      session.status !== "complete"
    ) {
      return res.status(400).send({
        success: false,
        message: "Invalid or incomplete payment session.",
      });
    }
    await OrderModel.create({
      courseId: courseId,
      userId: req.user._id,
      payment_status: session.payment_status,
      totalAmount: session.amount_total / 100,
    });

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });
    console.log("existingEnrollment", existingEnrollment);
    if (existingEnrollment) {
      return res.status(400).send({
        success: false,
        message: "Already enrolled in this course",
      });
    } else {
      const newEnrollment = new Enrollment({
        user: req.user._id,
        course: courseId,
        sessionId: sessionId, // Store the sessionId
        paymentStatus: session.payment_status,
        amount: session.amount_total / 100,
      });

      await newEnrollment.save();
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: { regCourses: courseId },
      });

      return res.status(200).send({
        success: true,
        message: "Payment successful! You are now enrolled.",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  makePayment,
  enrollUser,
};
