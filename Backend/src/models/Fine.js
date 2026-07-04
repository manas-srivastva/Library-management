import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(

    {

        borrowRecord: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "BorrowRecord",

            required: true,

            unique: true

        },

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        daysLate: {

            type: Number,

            required: true

        },

        dailyRate: {

            type: Number,

            default: 10

        },

        amount: {

            type: Number,

            required: true

        },

        status: {

            type: String,

            enum: [

                "PENDING",

                "PAID"

            ],

            default: "PENDING"

        },

        paidAt: Date

    },

    {

        timestamps: true

    }

);

export default mongoose.model(

    "Fine",

    fineSchema

);