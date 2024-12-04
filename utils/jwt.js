const jwt = require("jsonwebtoken");

const sendToken = async (user, status, res, next) => {
  try {
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE);
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE);
    const payload = {
      _id: user._id,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: `${accessTokenExpire}m`,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: `${refreshTokenExpire}d`,
    });

    const accessTokenOption = {
      // expires: new Date(Date.now() + accessTokenExpire *60 * 1000),
      expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
      maxAge: accessTokenExpire * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
    const refreshTokenOption = {
      expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
      maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
    res.cookie("access_token", accessToken, accessTokenOption);
    res.cookie("refresh_token", refreshToken, refreshTokenOption);
    res.status(status).send({ success: true, user, accessToken });
  } catch (error) {
    next(error);
  }
};
module.exports = sendToken;
