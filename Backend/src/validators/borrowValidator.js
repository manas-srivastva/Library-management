import { body } from "express-validator";

export const createBorrowValidator = [

    body("userId")
        .notEmpty()
        .withMessage("User ID required")
        .isMongoId()
        .withMessage("Invalid user ID"),

    body("bookCopyId")
        .notEmpty()
        .withMessage("Book copy ID required")
        .isMongoId()
        .withMessage("Invalid book copy ID"),

    body("dueDate")
        .notEmpty()
        .withMessage("Due date required")
        .isISO8601()
        .withMessage("Invalid date")

];