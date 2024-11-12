const { userUpdate, userDelete, updateAvatar } = require("../controller/user");
const authMiddleware = require("../middleware/authenticate/authMiddleware");
const router = require("express").Router();

router.put("/update/:id", authMiddleware, userUpdate);
router.patch("/upldate-avatar", authMiddleware, updateAvatar)
router.delete("/delete/:id", authMiddleware, userDelete);

module.exports = router;
