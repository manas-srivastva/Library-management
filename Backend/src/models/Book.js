import mongoose, { mongo } from "mongoose";

const bookSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true,
        trim:true
    },

    isbn:{
        type:String,
        required:true,
        unique:true
    },

    description:{
        type:String,
        default:""
    },

    language:{
        type:String,
        default:"English"
    },

    publicationYear:{
        type:Number
    },

    pages:{
        type:Number
    },
authors:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Author"
    }
],
    publisher:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Publisher"

    },

        category:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Category"

    },
    coverImage:{
        type:String,
        default:""
    }
},
{
    timestamps:true
}
);

export default mongoose.model("Book",bookSchema);