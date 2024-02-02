// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const validation = require("../utilities/inventory-validation")

router.get("/", utilities.Util.handleErrors(invController.invCont.buildManagementTools))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.Util.handleErrors(invController.invCont.buildByClassificationId))
router.get("/detail/:vehicleId", utilities.Util.handleErrors(invController.invCont.buildByVehicleId))


router.get("/add-classification", utilities.Util.handleErrors(invController.invCont.buildClassificationForm))
// Process the new Classification data
router.post(
    "/add-classification",
    validation.classRules(),
    validation.checkClass,
    utilities.Util.handleErrors(invController.registerClassification)
)

router.get("/add-inventory", utilities.Util.handleErrors(invController.invCont.buildInventoryForm))

router.post(
    "/add-inventory",
    validation.vehicleRules(),
    validation.checkVehicle,
    utilities.Util.handleErrors(invController.addInventory)
)


module.exports = router;