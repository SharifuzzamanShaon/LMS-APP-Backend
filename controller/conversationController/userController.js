const User = require("../../model/user.model");

const allUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    const allUser = users.map((item) => {
      return {
        _id: item._id,
        username: item.username,
        email: item.email,
        avatar: item.avatar,
      };
    });

    return res.status(200).send({ allUser });
  } catch (error) {
    next(error);
  }
};

module.exports = allUsers;
