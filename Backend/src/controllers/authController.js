import asyncHandler from "../utils/asyncHandler.js"

import ApiResponse from "../utils/ApiResponse.js"

import { register,login } from "../services/authService.js"

export const registerUser=asyncHandler(async(req,res)=>{
    const user=await register(req.body);
    res.status(201).json(new ApiResponse(
        201,"User registerd succesfully",user
    ))
})

export const loginUser=asyncHandler(async(req,res)=>{
    const{email,password}=req.body;

    const result=await login(email,password);
       res.status(200).json(

      new ApiResponse(

        200,

        "Login successful",

        result

      )

    ); 
})

export const me = asyncHandler(async (req, res) => {

    res.status(200).json(

        new ApiResponse(

            200,

            "User fetched successfully",

            req.user

        )

    );

});