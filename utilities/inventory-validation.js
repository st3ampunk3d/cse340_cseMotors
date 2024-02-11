const utilities = require(".")
const {body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

validate.classRules = () => {
    return [
        body("classification_name")
            .trim()
            .matches(/[A-Za-z0-9]/)
            .withMessage("Invalid name. No special characters allowed.")
            .custom(async (classification_name) => {
                const classExists = await invModel.checkExistingCat(classification_name)
                if (classExists){
                    throw new Error("Classification already exists.")
                }
            })
    ]
}

validate.checkClass = async (req,res,next) => {
    const classification_name = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.Util.getNav()
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            errors,
            nav,
            classification_name
        })
        return
    }
    next()
}

validate.checkVehicle = async (req,res,next) => {
    const {
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
    } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.Util.getNav()
        let categories = await utilities.Util.getCats()
        res.render("inventory/add-inventory", {
            title: "Add New Classification",
            errors,
            nav,
            categories,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
        return
    }
    next()
}

validate.checkUpdateData = async (req,res,next) => {
    const {
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
    } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.Util.getNav()
        let categories = await utilities.Util.getCats()
        res.render("inventory/edit-inventory", {
            title: `Editing: ${inv_make} ${inv_model}`,
            errors,
            nav,
            categories,
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
            classification_id,
        })
        return
    }
    next()
}

validate.vehicleRules = () => {
    return [
        body("inv_make")
            .trim()
            .matches(/[A-Za-z0-9]/)
            .withMessage("Invalid format. Numbers and letters only."),

        body("inv_model")
            .trim()
            .matches(/[A-Za-z0-9 .-]/)
            .withMessage("Invalid format. Numbers and letters only."),

        body("inv_year")
            .trim()
            .matches(/[0-9]/)
            .isLength(4)
            .withMessage("Enter a valid 4 digit year"),

        body("inv_description")
            .trim()
            .matches(/[A-Za-z0-9 .,!$?]/)
            .withMessage("Please remove special characters from the description. We're trying to avoid catastrophe."),

        body("inv_image")
            .trim()
            .matches(/(^.*\.(jpg|JPG|png|PNG)$)/)
            .withMessage("Custom Image uploading is not an option yet. Please use the no-image.png file for now."),

        body("inv_thumbnail")
            .trim()
            .matches(/(^.*\.(jpg|JPG|png|PNG)$)/)
            .withMessage("Custom Image uploading is not an option yet. Please use the no-image-tn.png file for now."),


        body("inv_price")
            .trim()
            .matches(/[0-9]/)
            .isLength({min: 3, max: 9})
            .withMessage("Invalid format. Must be a valid number (increments of 100)."),

        body("inv_miles")
            .trim()
            .matches(/[0-9]/)
            .withMessage("Invalid format. Must be a valid number."),

        body("inv_color")
            .trim()
            .matches(/[A-Za-z]/)
            .isLength({min: 3, max: 20})
            .withMessage("The name of that color looks a little odd. Enter a recognized color."),

        body("classification_id")
        .custom(async (classification_id) => {
            const classExists = await invModel.checkExistingCatById(classification_id)
            if (!classExists){
                throw new Error("Something went wrong. Invalid Classification.")
            }
        })
    ]
}


module.exports = validate