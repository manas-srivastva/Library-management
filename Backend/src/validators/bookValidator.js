import { body } from "express-validator";

export const createBookValidator = [

    body("title")
        .notEmpty()
        .withMessage("Title is required"),

    body("isbn")
        .notEmpty()
        .withMessage("ISBN is required"),

    body("authors")
        .isArray()
        .withMessage("Authors should be array"),

    body("publisher")
        .notEmpty()
        .withMessage("Publisher required"),




        
    body("category")
        .notEmpty()
        .withMessage("Category required")

];



export const updateBookValidator = [

    body("title")
        .optional(),

    body("isbn")
        .optional()

];