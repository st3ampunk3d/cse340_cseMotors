// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.Util.checkLogin, utilities.Util.handleErrors(accountController.buildManagement))


// Route to build inventory by classification view
router.get("/login", utilities.Util.handleErrors(accountController.buildLogin))

router.get("/logout", utilities.Util.handleErrors(accountController.logout))

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.Util.handleErrors(accountController.accountLogin))


// Rout to build the registration form
router.get("/register", utilities.Util.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.Util.handleErrors(accountController.registerAccount)
  )


  //Rout to build the Account update form
router.get("/update/", utilities.Util.handleErrors(accountController.buildUpdate))

//process the update data (email and name)
router.post(
  "/update/",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.Util.handleErrors(accountController.updateAccount)
)

//Process the update data (password change)
router.post(
  "/change-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.Util.handleErrors(accountController.changePassword)
)


module.exports = router;