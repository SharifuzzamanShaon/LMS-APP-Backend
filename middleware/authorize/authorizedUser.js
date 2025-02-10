const { authorizationError } = require("../../utils/error");

const authorizedUser =
  (roles = ["user"]) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }

    return next(authorizationError(req.user.role));
  };

module.exports = authorizedUser;