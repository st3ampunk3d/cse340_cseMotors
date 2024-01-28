const invModel = require("../models/inventory-model")
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

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display" class="no-bullets desktop-grid">'
    data.forEach(vehicle => { 
      grid += '<li class="card">'
      grid +=  '<div class="card-img"><a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a></div>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
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

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {Util}