// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const validation = require("../utilities/inventory-validation")
const auth = require("../utilities/auth")

router.get("/", auth, utilities.Util.handleErrors(invController.invCont.buildManagementTools))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.Util.handleErrors(invController.invCont.buildByClassificationId))
router.get("/detail/:vehicleId", utilities.Util.handleErrors(invController.invCont.buildByVehicleId))
router.get("/getInventory/:classification_id", utilities.Util.handleErrors(invController.invCont.getInventoryJSON))
router.get("/edit/:vehicleId", auth, utilities.Util.handleErrors(invController.invCont.editInventoryView))
router.get("/delete/:vehicleId", auth, utilities.Util.handleErrors(invController.invCont.deleteInventoryView))


router.get("/add-classification", auth, utilities.Util.handleErrors(invController.invCont.buildClassificationForm))
// Process the new Classification data
router.post(
    "/add-classification",
    auth,
    validation.classRules(),
    validation.checkClass,
    utilities.Util.handleErrors(invController.registerClassification)
)

router.get("/add-inventory", auth, utilities.Util.handleErrors(invController.invCont.buildInventoryForm))

router.post(
    "/add-inventory",
    auth,
    validation.vehicleRules(),
    validation.checkVehicle,
    utilities.Util.handleErrors(invController.addInventory)
)

router.post("/update/",
    auth,
    validation.vehicleRules(),
    validation.checkUpdateData,
    utilities.Util.handleErrors(invController.invCont.updateInventory))

router.post("/delete/", auth, utilities.Util.handleErrors(invController.invCont.deleteVehicle))

module.exports = router;