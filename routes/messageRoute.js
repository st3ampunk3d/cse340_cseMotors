const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const msgController = require("../controllers/messageController")
const validation = require("../utilities/message-validation")
const auth = require("../utilities/auth")

router.get("/", auth, utilities.Util.handleErrors(msgController.buildInboxView))

router.get("/sent",  auth, utilities.Util.handleErrors(msgController.buildSentView))

router.get("/archived", auth, utilities.Util.handleErrors(msgController.buildArchiveView))


router.get("/display/:messageId", auth, utilities.Util.handleErrors(msgController.buildReadView))

router.get("/new", auth, utilities.Util.handleErrors(msgController.buildSendView))

router.post("/send",
    auth,
    validation.sendRules(),
    validation.checkSend,
    msgController.sendNewMessage)

router.get("/reply/:messageId", auth, utilities.Util.handleErrors(msgController.buildReplyView))
router.post("/replied",
    auth,
    validation.replyRules(),
    validation.checkReply,
    utilities.Util.handleErrors(msgController.replyToMessage))

router.get("/isRead/:messageId", auth, utilities.Util.handleErrors(msgController.markRead))
router.get("/archive/:messageId", auth, utilities.Util.handleErrors(msgController.archiveMessage))
router.get("/delete/:messageId", auth, utilities.Util.handleErrors(msgController.deleteMessage))

module.exports = router