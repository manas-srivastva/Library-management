import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(

    {

        name: {

            type: String,

            required: true,

            trim: true,

            unique: true,

            minlength: 2,

            maxlength: 100

        },

        bio: {

            type: String,

            maxlength: 1000

        },

        birthDate: {

            type: Date

        },

        nationality: {

            type: String,

            trim: true

        },

        isActive: {

            type: Boolean,

            default: true

        }

    },

    {

        timestamps: true

    }

);

authorSchema.index({

    name: 1

});

const Author = mongoose.model(

    "Author",

    authorSchema

);

export default Author;