import { body } from "express-validator";

export const createReservationValidator = [

    body("user")

        .notEmpty()

        .withMessage(

            "User email required"

        ),

    body("book")

        .notEmpty()

        .withMessage(

            "Book title required"

        )

];