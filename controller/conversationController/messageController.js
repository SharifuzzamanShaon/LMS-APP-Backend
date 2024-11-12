const Chat = require("../../model/conversationModel/ChatModel");
const Message = require("../../model/conversationModel/MessageModel");
const User = require("../../model/user.model");

const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  try {
    if (!content || !chatId) {
      console.log("Invalid data Passed into req.");
      return res.status(400);
    }
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name picture email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    next(error);
  }
};
const allMessages = async (req, res, next) => {
  try {
    const id = req.user._id;
    const messages = await Message.find({ chat: req.params.chatId || id })
      .populate("sender", "name email")
      .populate("reciever")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  allMessages,
};
