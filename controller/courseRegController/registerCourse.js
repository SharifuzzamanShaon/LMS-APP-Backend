const User = require("../../model/user.model");
const { register } = require("../auth");

const registerToCourse = async (req, res, next) => {
  try {
    const { name, username, email, phone, password } = req.body;
    // Check if the user is already registered
    const isUserRegistered = await User.findOne({ email });
    if (!isUserRegistered) {
      await register(req, res, next); // Call register with the correct arguments
    } else {
      console.log("User is already registered:", isUserRegistered);
      return res.status(200).send({
        success: true,
        message: "User already registered, proceed to course registration.",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerToCourse };
