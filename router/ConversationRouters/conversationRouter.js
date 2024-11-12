const router = require("express").Router();
const chatRouter = require("../ConversationRouters/chatRouter");
const messageRouter = require("../ConversationRouters/messageRouter");
const allUsers = require("../../controller/conversationController/userController");

router.use("/chat", chatRouter);
router.use("/message", messageRouter);
router.get("/get-users", allUsers);

module.exports = router;
