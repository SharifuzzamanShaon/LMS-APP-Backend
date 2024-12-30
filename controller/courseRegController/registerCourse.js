const User = require("../../model/user.model");

const registerToCourse = async(req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const isUserRegisterd =await User.find({ email });
    console.log(isUserRegisterd);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerToCourse,
};
