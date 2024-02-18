const msgModel = require("../models/message-model")
const account = require("../models/account-model")
const utilities = require("../utilities/")
const strftime = require("strftime")
  

async function buildInboxView (req,res) {
    let messages = await msgModel.getInboxMessages(parseInt(res.locals.accountData.account_id))
  
    let messageList = ""


    messages.forEach(async function (message) {
        let sender = await account.getNameById(message.message_from)

        let status = "unread"
        let disabled = false
        if (message.message_read) {
            status = "read"
            disabled = true
        }
  
        messageList +=`<tr class="${status}">
            
            <td class="date"><a href="/messages/display/${message.message_id}">${message.message_date}</a></td>
            <td class="from"><a href="/messages/display/${message.message_id}">${sender}</a></td>
            <td class="subject"><a href="/messages/display/${message.message_id}">${message.message_subject}</a></td>
            
            <td class="options">
                <button class="option-btn reply-btn"><a href="/messages/reply/${message.message_id}">Reply</a></button>
                <button class="option-btn delete-btn"><a href="/messages/archived/${message.message_id}">Archive</a></button>`

        if (disabled) {
            messageList += `<button class="option-btn read-btn" disabled>Mark as Read</button>`
        } else {
            messageList += `<button class="option-btn read-btn"><a href="/messages/isRead/${message.message_id}">Mark as Read</a></button>`
        }
                
        messageList += `</td></tr>`
        
    }) 

    let nav = await utilities.Util.getNav()
    res.render("messages/inbox", {
      title: "Inbox",
      nav,
      errors: null,
      messageList  
    })
}

async function buildSentView (req,res) {
    let messages = await msgModel.getSentMessages(parseInt(res.locals.accountData.account_id))
  
    let messageList = ""


    messages.forEach(async function (message) {
        let recipient = await account.getNameById(message.message_to)
  
        messageList +=`<tr>
            
            <td class="date"><a href="/messages/display/${message.message_id}">${message.message_date}</a></td>
            <td class="from"><a href="/messages/display/${message.message_id}">${recipient}</a></td>
            <td class="subject"><a href="/messages/display/${message.message_id}">${message.message_subject}</a></td>
            
            <td class="options">
                <button class="option-btn reply-btn"><a href="/messages/reply/${message.message_id}">Reply</a></button>
                <button class="option-btn delete-btn"><a href="/messages/archived/${message.message_id}">Archive</a></button>
            </td>
        </tr>`
        
    }) 

    let nav = await utilities.Util.getNav()
    res.render("messages/sent", {
      title: "Sent Messages",
      nav,
      errors: null,
      messageList  
    })
}

async function buildArchiveView (req,res) {
    let messages = await msgModel.getArchived(parseInt(res.locals.accountData.account_id))
  
    let messageList = ""


    messages.forEach(async function (message) {
        let sender = await account.getNameById(message.message_from)
  
        messageList +=`<tr>
            
            <td class="date"><a href="/messages/display/${message.message_id}">${message.message_date}</a></td>
            <td class="from"><a href="/messages/display/${message.message_id}">${sender}</a></td>
            <td class="subject"><a href="/messages/display/${message.message_id}">${message.message_subject}</a></td>
            
            <td class="options">
                <button class="option-btn delete-btn"><a href="/messages/delete/${message.message_id}">Delete</a></button>
            </td>
        </tr>`
        
    }) 

    let nav = await utilities.Util.getNav()
    res.render("messages/sent", {
      title: "Archived Messages",
      nav,
      errors: null,
      messageList  
    })
}

async function buildSendView (req,res,next) {
    let user_id = res.locals.accountData.account_id
    let nav = await utilities.Util.getNav()
    let users = await utilities.Util.getUsers(user_id)

    res.render("messages/new", {
        title: `New Message`,
        nav,
        errors: null,
        users
    })
}

async function sendNewMessage (req,res,next) {
    const {message_subject, message_body, message_to, message_from} = req.body

    let from = await account.getAccountByEmail(message_from)

    const result = await msgModel.sendMessage(
        message_subject,
        message_body,
        message_to,
        from.account_id,
    )

    if (result) {
        req.flash("notice", "Message Sent Successfully!")
        res.redirect("/messages")
    } else {
        let nav = await utilities.Util.getNav()
        req.flash("notice", "Message could not be sent.")
        res.status(501).render("messages/new-message", {
            title: "New Message",
            nav,
            errors: null,
            message_subject,
            message_body,
            message_to,
            message_from
        })
    }
}

async function buildReadView (req,res,next) {
    const message_id = parseInt(req.params.messageId)
    const message = await msgModel.getMessageById(message_id)
    const date = new Date(message.message_created)
    const displayDate = strftime('%b %d', date)

    let nav = await utilities.Util.getNav()
    let read = await msgModel.markRead(message_id, true)
    let sender = await account.getNameById(message.message_from)
        res.render(`messages/display`, {
            title: `Subject: ${message.message_subject}`,
            nav,
            errors: null,
            message_from: sender,
            message_created: displayDate,
            message_body: message.message_body
    })
}

async function buildReplyView (req,res,next) {
    const message_id = parseInt(req.params.messageId)
    const message = await msgModel.getMessageById(message_id)
    const date = new Date(message.message_created)
    const displayDate = strftime('%b %d', date)

    let nav = await utilities.Util.getNav()
    let sender = await account.getNameById(message.message_from)
        res.render(`messages/reply`, {
            title: `RE: ${message.message_subject}`,
            nav,
            errors: null,
            message_from: sender,
            message_created: displayDate,
            original_body: message.message_body
    })
}

async function replyToMessage (req,res,next) {
    const {message_body, message_subject, message_to, message_created, original_body} = req.body

    let to = await account.getIdByName(message_to)
    let from = await res.locals.accountData.account_id

    const result = await msgModel.sendMessage(
        message_subject,
        message_body,
        to,
        from,
        original_body
    )

    if (result) {
        req.flash("notice", "Message Sent Successfully!")
        res.redirect("/messages")
    } else {
        let nav = await utilities.Util.getNav()
        req.flash("notice", "Message could not be sent.")
        res.status(501).render("messages/reply", {
            title: message_subject,
            nav,
            errors: null,
            message_created,
            message_body,
            to,
            from,
            original_body
        })
    }
}

async function archiveMessage (req,res,next) {
    const message_id = req.params
    let result = await msgModel.archiveMessage(message_id)
    if (result) {
        let nav = await utilities.Util.getNav()
        let messageList = await getInboxMessages()
        req.flash("notice", "Message was archived")
        res.status(201).render("messages/inbox", {
            title: "inbox",
            nav,
            errors: null,
            messageList
        })
    } else {
        let nav = await utilities.Util.getNav()
        let messageList = await getInboxMessages()
        req.flash("notice", "Action failed. Please try again.")
        res.status(501).render("messages/inbox", {
            title: "inbox",
            nav,
            errors: null,
            messageList
        })
    }
}

async function deleteMessage (req,res,next) {
    const message_id = req.params.messageId
    let result = await msgModel.deleteMessage(message_id)
    if (result) {
        req.flash("notice", "Message was Deleted")
        res.redirect("/messages/archived")
    } else {
        req.flash("notice", "Action failed. Please try again.")
        res.redirect("/messages/archived")
        }
}

async function markRead (req,res,next) {
    const message_id = parseInt(req.params.messageId)
    let result = await msgModel.markRead(message_id, true)
    if (result) {
        res.redirect("/messages")
    } else {
        req.flash("notice", "Action failed. Please try again.")
        res.status(501).render("messages/inbox", {
            title:"Inbox",
            nav,
            errors: null,
            messageList
        })
    }
}

module.exports = {
    buildInboxView,
    buildSentView,
    buildArchiveView,
    buildReadView,
    buildReplyView,
    buildSendView,
    sendNewMessage,
    replyToMessage,
    archiveMessage,
    deleteMessage,
    markRead
}