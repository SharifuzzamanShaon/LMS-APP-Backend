const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeUser} = require('../../controller/conversationController/chatController')

const router = require('express').Router()

router.post("/access-chat/:userId", accessChat)
router.get("/", fetchChats)
router.post("/group", createGroupChat)
router.put("/rename", renameGroup)
router.post("/add-to-group", addToGroup)
router.put("/group-remove", removeUser)


module.exports = router