const User = require("../model/user.model");
const error = require("../utils/error");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/FileUpload");

const profileAccess = async (req, res) => {
  try {
    const userExists = User.findById(req.id);
    if (!userExists) throw error("Forbidden to access", 403);
    return res.status(200).send("valid user");
  } catch (err) {
    next(err);
  }
};

const userUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, avatar } = req.body;

    // if (req.user.id !== req.params.id) throw error("You can only update your Account", 403)
    // const user = await User.findById(id);
    if (!username) throw error("username required", 204);
    if (!email) throw error("email required", 204);
    if (!password) throw error("password required", 204);
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const payload = {
      id,
      username,
      email,
    };
    const token = await jwt.sign(payload, "privateKey", { expiresIn: "4h" });
    return res
      .status(200)
      .send({ msg: "Updated value", userInfo: updateUser, token });
  } catch (error) {
    next(error);
  }
};
const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    // const base64Data = avatar.split(',')[1]
    // console.log(base64Data);
    
    let user = await User.findById(req.user._id);
    const buffer = Buffer.from(avatar, "base64");
    fs.writeFileSync("outputfile", buffer);
    const response = await uploadOnCloudinary(avatar);
    user.avatar = response.secure_url;
    await user?.save();
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};
const userDelete = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const id = req.user._id.toString();
    console.log(id);

    if (req.params.id !== id)
      throw error("You can only delete your Account", 403);
    const userDelete = await User.findByIdAndDelete({ _id: req.params.id });
    const deletedUser = {
      _id: userDelete._id,
      username: userDelete.username,
      email: userDelete.email,
    };
    return res
      .status(200)
      .send({ message: "user delete success", deletedUser });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  userUpdate,
  updateAvatar,
  userDelete,
  profileAccess,
};
