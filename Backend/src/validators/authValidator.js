import { body } from "express-validator"

export const registerValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

    body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 12 })
        .withMessage("Password must be at least 12 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage("Password must contain uppercase, lowercase, number, and special character (@$!%*?&)")

];

export const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
];