import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(

    {

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        bookCopy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "BookCopy",

            required: true

        },

        issuedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        issueDate: {

            type: Date,

            default: Date.now

        },

        dueDate: {

            type: Date,

            required: true

        },

        returnDate: {

            type: Date

        },

        status: {

            type: String,

            enum: [

                "BORROWED",

                "RETURNED",

                "OVERDUE"

            ],

            default: "BORROWED"

        }

    },

    {

        timestamps: true

    }

);

export default mongoose.model(

    "BorrowRecord",

    borrowRecordSchema

);