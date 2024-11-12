const router = require("express").Router();
const {
  register,
  login,
  socialAuth,
  foregtPassword,
  resetPassword,
  verifyAccount,
  confirmVerification,
  activation,
  logout,
  updateToken,
} = require("../controller/auth");
const authMiddleware = require("../middleware/authenticate/authMiddleware");
const { runValidation } = require("../middleware/validation");
const { schemas } = require("../middleware/validation/schema");

router.post("/register", runValidation(schemas.signup), register);
router.post("/activate-account", activation);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh",authMiddleware, updateToken);
router.post("/social-auth", socialAuth);
router.post("/forget-password", foregtPassword);
router.post(
  "/reset-password",
  runValidation(schemas.resetPassword),
  resetPassword
);
module.exports = router;

// router.post("/verify-account", verifyAccount)
// router.post("/confirm-verification", confirmVerification)
