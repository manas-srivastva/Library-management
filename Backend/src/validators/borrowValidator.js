import { body } from "express-validator";

export const createBorrowValidator = [

    body("user")

        .notEmpty()

        .withMessage("User email required"),

    body("barcode")

        .notEmpty()

        .withMessage("Barcode required"),

    body("issuedBy")

        .notEmpty()

        .withMessage("Issuer email required"),

    body("dueDate")

        .notEmpty()

        .withMessage("Due date required")

        .isISO8601()

        .withMessage("Invalid date")

];