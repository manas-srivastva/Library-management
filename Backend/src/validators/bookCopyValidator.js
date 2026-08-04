import { body } from "express-validator";

export const createBookCopyValidator = [

    body("book")
        .notEmpty()
        .withMessage("Book is required"),

    body("barcode")
        .notEmpty()
        .withMessage("Barcode required"),

    body("shelfLocation")
        .notEmpty()
        .withMessage("Shelf location required"),

    body("status")
        .optional()
        .isIn([
            "AVAILABLE",
            "BORROWED",
            "RESERVED",
            "LOST",
            "MAINTENANCE"
        ])
        .withMessage("Invalid status")

];

export const updateBookCopyValidator = [

    body("barcode")
        .optional()
        .notEmpty()
        .withMessage("Barcode cannot be empty"),

    body("shelfLocation")
        .optional()
        .notEmpty()
        .withMessage("Shelf location cannot be empty"),

    body("status")
        .optional()
        .isIn([
            "AVAILABLE",
            "BORROWED",
            "RESERVED",
            "LOST",
            "MAINTENANCE"
        ])
        .withMessage("Invalid status")

];