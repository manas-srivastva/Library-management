import moongoose from "mongoose"
import bcrypt from "bcryptjs"

import ROLES from "../constants/roles.js"
import {USER_STATUS} from "../constants/statuses.js"

const userSchema=new moongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name is required"],
            trim:true,
            minlength:2,
            maxlength:50
        },
        email: {
            type:String,
            required:[true,"Email is required"],
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },

        password:{
            type:String,
            required:[true,"Password is required"],
            minlength:8,
            select:false
        },
        role:{
            type:String,
            enum:Object.values(ROLES),
            default:ROLES.MEMBER
        },

        status:{
        type: String,

        enum: Object.values(USER_STATUS),

        default: USER_STATUS.ACTIVE
        },


        phone: {
            type:String,
            trim:true
        },

        profileImage:{
            type:String
        }
    },
    {
        timestamps:true
    }
);

userSchema.pre("save",async function () {
    if(!this.isModified("password")) return
        
    

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(
        this.password,
        salt

    );
    
});

userSchema.methods.comparePassword=async function(
    candidatePassword
){
    return await bcrypt.compare(candidatePassword,this.password);
};
userSchema.index({
    email:1
})

const User=moongoose.model("User",userSchema);

export default User;