import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(

    {

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        book: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Book",

            required: true

        },

        reservationDate: {

            type: Date,

            default: Date.now

        },

        expiryDate: {

            type: Date

        },

        status: {

            type: String,

            enum: [

                "ACTIVE",

                "FULFILLED",

                "CANCELLED",

                "EXPIRED"

            ],

            default: "ACTIVE"

        }

    },

    {

        timestamps: true

    }

);

export default mongoose.model(

    "Reservation",

    reservationSchema

);