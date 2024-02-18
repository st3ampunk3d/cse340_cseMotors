const invModel = require("../models/inventory-model")
const msgModel = require("../models/message-model")
const accntModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="flex">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.getCats = async (req,res,next) => {
  let data = await invModel.getClassifications()
  let list =
  `<select name="classification_id" id="classificationId">
    <option value="default">Select an Option</option>`

  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })
  list += `</select>`
  return list
}

Util.getUsers = async (account_id, req,res,next) => {
  let data = await accntModel.getAllUsers(account_id)
  let list = 
  `<select name="message_to" id="messageTo">
    <option value="default">Send to...</option>`

  data.rows.forEach((row) => {
    list += `<option value="${row.account_id}">${row.account_email}</option>`
  })
  list += `</select>`
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = `<div class="desktop-grid">`
    data.forEach(vehicle => {
      grid += `
      <div class="media-card">
        <a href=" ../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
          <div class="namePrice">
            <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
            <span class="price">$${new Intl.NumberFormat('en-us').format(vehicle.inv_price)}</span>
          </div>
        </a>
      </div>`
    })
    grid += `</div>`
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildManagementTools = async () =>{
  let actions
  actions += `<button type=">`
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildDetailsGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div class="desktop-grid">'
    data.forEach(vehicle => { 
      grid += `<div class="left">
                 <img class="full" src="${vehicle.inv_image}"
                  alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
               </div>`
      grid += `<div class="right">
                 <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
                 <ul class="no-bullets">
                   <li class="highlight"><span>Price: </span>$${vehicle.inv_price}</li>
                   <li><span>Description: </span>${vehicle.inv_description}</li>
                   <li class="highlight"><span>Color: </span>${vehicle.inv_color}</li>
                   <li><span>Miles: </span>${vehicle.inv_miles}</li>
                 </ul>
               </div>`
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {Util}