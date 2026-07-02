import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },

    description:{
        type:String,
        trim:true
    },

    website:{
        type:String,
        trim:true
    },

    country:{
        type:String,
        trim:true
    }
},
{
    timestamps:true
}
);

export default mongoose.model("Publisher",publisherSchema);