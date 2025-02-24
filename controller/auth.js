const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const { error } = require("../utils/error");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const sendEmail = require("../utils/sendEmail");
const ejs = require("ejs");
const path = require("path");
const { createActivationToken } = require("../services/activationToken");
const sendToken = require("../utils/jwt");
const { redis } = require("../DB/redis");
const { json } = require("body-parser");
require("dotenv").config();

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username) throw new Error("Username is required", 400);
    if (!email) throw new Error("Email is required", 400);
    if (!password) throw new Error("Password is required", 400);

    const isExists = await User.findOne({ email: email });
    if (isExists) {
      return res.status(409).send({ message: "user already exists" });
    }
    const user = {
      username,
      email,
      password,
    };
    const activationToken = await createActivationToken(user);
    const data = {
      name: `${user.username}`,
      activationCode: activationToken.activationCode,
    };

    const filePath = path.join(__dirname, "../views/mail/activateAccount.ejs");
    await ejs.renderFile(filePath, data, (err, str) => {
      if (err) {
        return res.status(500).send("Error rendering template");
      }
      sendEmail(`${user.email}`, "Activate Your Account", str);
    });
    return res.status(200).send({
      success: true,
      message: "mail sent to activate account",
      activationToken: activationToken.token,
    });
  } catch (error) {
    next(error);
  }
};
const activation = async (req, res, next) => {
  try {
    const { activationCode, activationToken } = req.body;
    const newUserInfo = jwt.verify(
      activationToken,
      process.env.ACC_ACTIVATION_SECRETKEY
    );
    if (newUserInfo.activationCode != activationCode) {
      throw error("Invalid activation code or time expired", 404);
    }
    const { username, email, password } = newUserInfo.user;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    return res
      .status(201)
      .send({ success: true, messgae: "Signup successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw error("email and password is required", 400);
    const user = await User.findOne({ email: email });
    if (!user) throw error("user not found", 404);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw error("Password not match", 401);
    const payload = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      regCourses: user.regCourses,
    };
    await redis.set(user._id, JSON.stringify(payload));
    sendToken(payload, 200, res, next);
  } catch (err) {
    next(err);
  }
};
const logout = async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    await redis.del(`"${req.user._id}"`);
    res.status(200).send({ success: true, message: "Logout Success" });
  } catch (error) {
    next(error);
  }
};

const updateToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    if (!decode) throw error("invalid token", 400);
    const validUser = await redis.get(`"${decode._id}"`);
    if (!validUser)
      return res
        .status(400)
        .send({ success: false, message: "could not refresh token" });
    const payload = {
      _id: validUser._id,
      username: validUser.username,
      email: validUser.email,
      avatar: validUser.avatar,
      role: validUser.role,
    };
    sendToken(payload, 200, res, next);
  } catch (error) {
    next(error);
  }
};

const socialAuth = async (req, res, next) => {
  const { name, email, photoURL } = req.body;
  try {
    const validUser = await User.findOne({ email: email });
    if (validUser) {
      const payload = {
        _id: validUser._id,
        username: validUser.username,
        email: validUser.email,
        avatar: validUser.avatar,
        role: validUser.role,
      };
      sendToken(payload, 200, res, next);
    } else {
      const generatePass = Math.random().toString(36).slice(-8);
      // const username =
      //   name.split(" ").join("").toLowerCase() +
      //   Math.random().toString(10).slice(-2);
      const hash = await bcrypt.hash(generatePass, saltRounds);
      const newUser = new User({
        username: email,
        email,
        password: hash,
        avatar: photoURL,
      });
      const userInfo = await newUser.save();
      const payload = {
        _id: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
        avatar: userInfo.avatar,
        role: userInfo.role,
      };
      await redis.set(payload._id, payload);
      sendToken(payload, 200, res, next);
    }
  } catch (err) {
    next(err);
  }
};

const foregtPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    let userExist = await User.findOne({ email: email });
    if (!userExist) throw error("user not found", 404);
    const payload = {
      username: userExist.username,
      email: userExist.email,
    };
    const token = jwt.sign(payload, "privateKeyResetPass", { expiresIn: "1h" });
    const url = `${process.env.CLIENT_URL}/reset-password?email=${payload.email}&token=${token}`;
    const data = {
      name: `${userExist.username}`,
      url: url,
    };
    await User.findOneAndUpdate(
      { email: email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 10 * 60 * 1000,
      }
    );
    const filePath = path.join(__dirname, "../views/mail/resetPassword.ejs");
    await ejs.renderFile(filePath, data, (err, str) => {
      if (err) {
        return res.status(500).send("Error rendering template");
      }
      // return res.send(str)
      sendEmail(`${userExist.email}`, "Testing mail", str);
    });
    return res
      .status(200)
      .send({ message: "sent mail for reset new password" });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    let queryString = req.url.split("?")[1];

    // Replace any occurrence of &amp; with &
    if (queryString) {
      const email = req.query.email;
      const token = req.query.token;

      if (!email || !token) throw error("invalid credentials", 401);
      const validUser = await User.findOne({ email: email });
      if (!validUser) throw error("user not found", 404);
      const validTimeToReset =
        new Date() < new Date(validUser.resetPasswordExpires);
      if (!validTimeToReset) throw error("token expired, try again", 401);
      if (validUser.resetPasswordToken != token)
        throw error("invalid token, try again", 401);
      const { newPassword } = req.body;
      const hash = await bcrypt.hash(newPassword, saltRounds);
      await User.findOneAndUpdate(
        { email: validUser.email },
        { password: hash }
      );
      return res.status(200).send({ messgae: "passward reset success" });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  register,
  activation,
  login,
  logout,
  updateToken,
  socialAuth,
  foregtPassword,
  resetPassword,
};

/**
 * const verifyAccount = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) throw error("invalid credentials", 401)
        const userExist = await User.findOne({ email: email });
        if (userExist.isVerified === true) return res.status(200).send({ message: 'alread verified' });
        const payload = {
            email: email
        }
        const token = jwt.sign(payload, "privateKeyVerifyAcc", { expiresIn: "1h" });
        const url = `${process.env.CLIENT_URL}/confirm-verification?email=${userExist.email}&token=${token}`;

        await User.findOneAndUpdate({ email: email }, { verificationToken: token });
        const data = {
            name: `${userExist.username}`,
            url: url,
        }
        const filePath = path.join(__dirname, '../views/mail/verifyEmail.ejs');
        await ejs.renderFile(filePath, data, (err, str) => {
            if (err) {
                return res.status(500).send('Error rendering template');
            }
            sendEmail(`${userExist.email}`, "Verify your Email", str)
        })
        return res.status(200).send({ message: 'mail has sent to verify account' })
    } catch (error) {
        next(error)
    }
}
const confirmVerification = async (req, res, next) => {
    try {
        const email = req.query.email
        const token = req.query.token
        if (!email || !token) throw error("invalid credentials", 401)
        const validUser = await User.findOne({ email: email })
        if (!validUser) throw error("user not found", 404)
        if (validUser.verificationToken != token) throw error("invalid token, try again", 401)
        await User.findOneAndUpdate({ email: validUser.email }, { isVerified: true })
        return res.status(200).send({ messgae: "Account verification success" })

    } catch (error) {
        next(error)
    }
}
 */
