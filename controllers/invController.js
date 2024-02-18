const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ************************** *
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.Util.buildClassificationGrid(data)
  let nav = await utilities.Util.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const grid = await utilities.Util.buildDetailsGrid(data)
  let nav = await utilities.Util.getNav()
    const vehicle = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/details", {
      title: `${vehicle}`,
      nav,
      grid,
    })

}

invCont.buildManagementTools = async function (req,res,next) {
  let nav = await utilities.Util.getNav()
  const categories   = await utilities.Util.getCats()
  res.render("./inventory/management", {
    title: "Inventory Management Tools",
    nav,
    categories,
    errors: null
  })
}

/* ****************************************
*  Deliver Add Classification view
* *************************************** */
invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.Util.getNav()
  res.render("./inventory/add-classification", {
    title: "Register New Classification",
    nav,
    errors: null
  })
}

invCont.buildInventoryForm = async function (req, res, next) {
  let nav = await utilities.Util.getNav()
  let categories = await utilities.Util.getCats()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    errors: null,
    categories
  })
}

async function addInventory(req, res) {
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body

  const fullImagePath = `/images/vehicles/${inv_image}`
  const fullThumbPath = `/images/vehicles/${inv_thumbnail}`

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    fullImagePath,
    fullThumbPath,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )


  if (result) {
    let nav = await utilities.Util.getNav()
    let categories = await utilities.Util.getCats()
    req.flash(
      "notice",
      `Inventory updated successfully.`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add new Inventory",
      nav,
      errors: null,
      categories,
    })
  } else {
    req.flash("notice", "Sorry, the action failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add new Inventory",
      nav,
      errors: null,
      categories 
    })
  }
}

async function registerClassification(req, res) {
  const {classification_name} = req.body
  const regResult = await invModel.registerClassification(
    classification_name
  )

  if (regResult) {
    let nav = await utilities.Util.getNav()
    let categories = await utilities.Util.getCats()
    req.flash(
      "notice",
      `Congratulations! ${classification_name} has been added.`
    )
    res.status(201).render("inventory/edit-inventory", {
      title: "Inventory Management",
      nav,
      errors: null,
      categories
    })
  } else {
    let nav = utilities.Util.getNav()
    req.flash("notice", "Sorry, the action failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.vehicleId)
  let nav = await utilities.Util.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const categories = await utilities.Util.getCats(itemData[0]["classification_id"])
  const itemName = `${itemData[0]["inv_make"]} ${itemData[0]["inv_model"]}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    categories: categories,
    errors: null,
    inv_id: itemData[0]["inv_id"],
    inv_make: itemData[0]["inv_make"],
    inv_model: itemData[0]["inv_model"],
    inv_year: itemData[0]["inv_year"],
    inv_description: itemData[0]["inv_description"],
    inv_image: itemData[0]["inv_image"],
    inv_thumbnail: itemData[0]["inv_thumbnail"],
    inv_price: itemData[0]["inv_price"],
    inv_miles: itemData[0]["inv_miles"],
    inv_color: itemData[0]["inv_color"],
    classification_id: itemData[0]["classification_id"]
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.Util.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const fullImagePath = `/images/vehicles/${inv_image}`
  const fullThumbPath = `/images/vehicles/${inv_thumbnail}`

  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    fullImagePath,
    fullThumbPath,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult["inv_make"] + " " + updateResult["inv_model"]
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv")
  } else {
    let categories = await utilities.Util.getCats()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    categories,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build Delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.vehicleId)
  let nav = await utilities.Util.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const itemName = `${itemData[0]["inv_make"]} ${itemData[0]["inv_model"]}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0]["inv_id"],
    inv_make: itemData[0]["inv_make"],
    inv_model: itemData[0]["inv_model"],
    inv_year: itemData[0]["inv_year"],
    inv_price: itemData[0]["inv_price"],
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.Util.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body

  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    const itemName = deleteResult["inv_make"] + " " + deleteResult["inv_model"]
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, failed to delete the item.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}


module.exports = {invCont, invModel, registerClassification, addInventory};
