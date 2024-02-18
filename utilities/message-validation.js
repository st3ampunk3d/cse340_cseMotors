const utilities = require(".")
const {body, validationResult} = require("express-validator")
const account = require("../models/account-model")
const validate = {}

validate.sendRules = () => {
    return [
        body('message_to')
            .isInt()
            .withMessage('Message to must be an integer'),

        body('message_from')
            .isInt()
            .withMessage('Message from must be an integer'),

        body('message_subject')
            .trim()
            .notEmpty()
            .withMessage('Message subject is required'),

        body('message_body')
            .trim()
            .notEmpty()
            .withMessage('Message body is required')
    ]
}

validate.replyRules = () => {
    return [
        body('message_to')
            .notEmpty()
            .withMessage('A recipient is required'),

        body('message_created')
            .notEmpty(),

        body('message_subject')
            .trim()
            .notEmpty()
            .withMessage('Message subject is required'),

        body('message_body')
            .trim()
            .notEmpty()
            .withMessage('Message body is required')
    ]
}

validate.checkReply = async (req,res,next) => {
    const {message_subject, message_body, message_to, message_from, message_created, original_body} = req.body

    console.log(req.body)

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {

        let nav = await utilities.Util.getNav()
        res.render("messages/reply", {
            title: message_subject,
            nav,
            errors,
            message_subject,
            message_created,
            message_body,
            message_to,
            message_from: message_to,
            original_body
        })
        return
    }
    next()
}

validate.checkSend = async (req,res,next) => {
    const {message_subject, message_body, message_to, message_from} = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.Util.getNav()
        res.render("messages/new", {
            title: "New Message",
            nav,
            errors,
            message_subject,
            message_body,
            message_to,
            message_from
        })
        return
    }
    next()
}

module.exports = validate