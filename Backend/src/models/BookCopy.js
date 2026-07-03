import mongoose from "mongoose";

import { COPY_STATUS }
    from "../constants/statuses.js";

const bookCopySchema =
    new mongoose.Schema(

        {

            book: {

                type: mongoose.Schema.Types.ObjectId,

                ref: "Book",

                required: true

            },

            barcode: {

                type: String,

                required: true,

                unique: true

            },

            shelfLocation: {

                type: String,

                required: true

            },

            status: {

                type: String,

                enum: Object.values(COPY_STATUS),

                default: COPY_STATUS.AVAILABLE

            }

        },

        {

            timestamps: true

        }

    );

export default mongoose.model(

    "BookCopy",

    bookCopySchema

);