async function authenticate (req,res,next) {
    if (res.locals.loggedin == 1) {
        //console.log(res.locals.accountData)
        if (res.locals.accountData.account_type != "Client") {
            return next()
        } else {
            req.flash("notice", "You do not have access to view that page.")
            res.redirect("/")
        }
    } else {
        req.flash("notice", "You must be logged in to view that page.")
        res.redirect("/account/login")
    }
}

module.exports = authenticate