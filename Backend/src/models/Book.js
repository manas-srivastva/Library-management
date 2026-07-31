import mongoose from "mongoose";

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
        unique:true,
        trim:true
    },

    description:{
        type:String,
        trim:true,
        default:""
    },

    language:{
        type:String,
        trim:true,
        default:"English"
    },

    publicationYear:{
        type:Number,
        min:1000,
        max:new Date().getFullYear()
    },

    pages:{
        type:Number,
        min:1
    },
authors:{
    type:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Author"
    }],
    validate:{
        validator:(value)=>value.length>0,
        message:"At least one author is required."
    }
},
    publisher:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Publisher",
        required:true

    },

        category:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Category",
        required:true

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

bookSchema.index({ title: 1 });
bookSchema.index({ category: 1 });

export default mongoose.model("Book",bookSchema);