import { body } from "express-validator"

export const registerValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 chracters"),

    body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")

        .isLength({ min: 8 })

        .withMessage(

            "Password must be at least 8 characters"

        )

];

export const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
];