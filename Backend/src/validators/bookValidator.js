import { body } from "express-validator";

export const createBookValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("isbn")
        .trim()
        .notEmpty()
        .withMessage("ISBN is required"),

    body("authors")
        .isArray({ min: 1 })
        .withMessage("At least one author is required"),

    body("authors.*")
        .isMongoId()
        .withMessage("Invalid author id"),

    body("publisher")
        .isMongoId()
        .withMessage("Valid publisher id is required"),

    body("category")
        .isMongoId()
        .withMessage("Valid category id is required"),

    body("publicationYear")
        .optional()
        .isInt({
            min: 1000,
            max: new Date().getFullYear()
        })
        .withMessage("Invalid publication year"),

    body("pages")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Pages must be greater than 0")

];

export const updateBookValidator = [

    body("title")
        .optional()
        .trim()
        .notEmpty(),

    body("isbn")
        .optional()
        .trim()
        .notEmpty(),

    body("authors")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one author is required"),

    body("authors.*")
        .optional()
        .isMongoId()
        .withMessage("Invalid author id"),

    body("publisher")
        .optional()
        .isMongoId()
        .withMessage("Invalid publisher id"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Invalid category id"),

    body("publicationYear")
        .optional()
        .isInt({
            min: 1000,
            max: new Date().getFullYear()
        }),

    body("pages")
        .optional()
        .isInt({ min: 1 })

];