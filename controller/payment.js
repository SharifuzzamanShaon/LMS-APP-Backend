const stripe = require("stripe")(
  "sk_test_51Qq6EcK5LodKUJLl0HG1snEOb78wvVIY70sNfQgkI5GTmTRZWqNcRhRRmXA0XGOCXgdWqNdxk26e4dzC09xbOQd800HodFA48a"
);
const makePayment = async (req, res, next) => {
  try {
    // Access the course data from `isCacheExist`
    const course = req.body;
    console.log("Course Details:", course);
    console.log(course.price);
    // Validate and parse course.price
    const price = parseFloat(course.price);
    if (isNaN(price)) {
      throw new Error("Invalid course price. Price must be a valid number.");
    }
    // Convert price to integer (Stripe requires amount in the smallest currency unit)
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
      success_url: `https://www.google.com/`,
      cancel_url: `https://www.facebook.com/`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    next(error);
  }
};

module.exports = {
  makePayment,
};
