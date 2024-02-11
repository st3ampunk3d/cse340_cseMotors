const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.Util.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.Util.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

async function buildManagement(req, res, next) {
  let nav = await utilities.Util.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.Util.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   console.log(accountData.account_firstname)
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.Util.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

async function buildUpdate(req, res, next) {
  let nav = await utilities.Util.getNav()
  const account_id = res.locals.accountData.account_id
  res.render("account/update", {
    title: "Update Account",
    nav,
    account_id,
    errors: null
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.Util.getNav()
  console.log(req.body)
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  console.log(account_id)

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", `${account_firstname}, your account was updated successfully.`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, your account could not be updated.")
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
    })
  }
}

async function changePassword(req, res) {
  let nav = await utilities.Util.getNav()
  const {account_id, current_password, new_password } = req.body
  accountData = await accountModel.getAccountById(account_id)

  try {
    if (await bcrypt.compare(current_password, accountData.account_password)) {
      // Hash the password before storing
      try {
        // regular password and cost (salt is generated automatically)
        const hashedPassword = bcrypt.hashSync(new_password, 10)

        const result = await accountModel.changePassword(
          account_id,
          hashedPassword
        )

        if (result) {
          req.flash(
            "notice",
            `Your password has been updated.`
          )
          res.status(201).render("account/management", {
            title: "Account Management",
            nav,
            errors: null
          })
        } else {
          req.flash("notice", "Sorry, there was an error updating the password.")
          res.status(501).render("account/update", {
            title: "Update Account",
            nav,
            account_id,
            errors: null
          })
        }

      } catch (error) {
        req.flash("notice", 'Sorry, there was an error updating the password.')
        res.status(500).render("account/update", {
          title: "Update Account",
          nav,
          account_id,
          errors: null
        })
      }
    } else {
        req.flash("notice", 'Incorrect password. Could not update your password.')
        res.status(500).render("account/update", {
          title: "Update Account",
          nav,
          account_id,
          errors: null
        })
    }
  } catch (error) {
    req.flash("notice", 'Access denied. Please login.')
    res.redirect("/account/login")
    return
  }
  return
} 

async function logout(req,res,next) {
  res.clearCookie('jwt')
  req.flash("notice", 'Logout Successful.')
  res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  buildUpdate,
  changePassword,
  updateAccount,
  logout
}

