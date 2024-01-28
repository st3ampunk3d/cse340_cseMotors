// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.Util.handleErrors(invController.invCont.buildByClassificationId))
router.get("/detail/:vehicleId", utilities.Util.handleErrors(invController.invCont.buildByVehicleId))


module.exports = router;