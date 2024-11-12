const User = require("../model/user.model");

const findUserByProperty = (key, value) => {
  if (key == "_id") {
    return User.findById(value);
  }
  return User.findOne({ [key]: value }); //it means that the key of the object is dynamic and determined by the value of the key variable.
};

function getUsers() {
  return User.find();
}

function deleteUser(key, value) {
  return User.findOneAndRemove({ [key]: value });
}
module.exports = {
  findUserByProperty,
  getUsers,
  deleteUser,
};
