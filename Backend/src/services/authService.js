import jwt from "jsonwebtoken"

import ApiError from "../utils/ApiError.js"

import { createUser,findByEmail } from "../repositories/userRepository.js"


// Register User

export const register=async (userData)=>{
    const existingUser=await findByEmail(
        userData.email
    );

    if(existingUser){
        throw new ApiError(
            400,
            "User already exists"
        );
    }

    const user =await createUser(userData);
    return user;
}

// login user
export const login=async(
    email,
    password)=>{
    const user=await findByEmail(email).select("+password");
  if (!user) {

    throw new ApiError(

      401,

      "Invalid credentials"

    );

  }  

  const isMatch=await user.comparePassword(password);
    if (!isMatch) {

    throw new ApiError(

      401,

      "Invalid credentials"

    );

  }
  const token=jwt.sign(
    //payload
    {
        id:user._id,
        role:user.role

    },
    //secret
    process.env.JWT_SECRET,
    {
        expiresIn:
        process.env.JWT_EXPIRES_IN
    }
  );

  return {
    user,token
  };
};