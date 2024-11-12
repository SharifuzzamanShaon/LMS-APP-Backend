const jwt = require("jsonwebtoken");

const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACC_ACTIVATION_SECRETKEY,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};
module.exports = { createActivationToken };
