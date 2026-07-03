import { body } from "express-validator";

export const createBookCopyValidator = [

    body("book")

        .notEmpty()

        .withMessage(

            "Book is required"

        ),

    body("barcode")

        .notEmpty()

        .withMessage(

            "Barcode required"

        ),

    body("shelfLocation")

        .notEmpty()

        .withMessage(

            "Shelf location required"

        )

];


export const updateBookCopyValidator = [

    body("status")

        .optional()

];
