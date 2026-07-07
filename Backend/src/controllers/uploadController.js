import asyncHandler from "../utils/asyncHandler.js"

import ApiResponse from "../utils/ApiResponse.js"

import * as uploadService from "../services/uploadService.js"

export const uploadBookCover=asyncHandler(async(req,res)=>{
    const result=uploadService.uploadBookCover(req.file);

    res.status(200)
    .json(
        new ApiResponse(200,result,"Book Cover Uploaded")
    );
});

export const uploadAvatar=asyncHandler(async(req,res)=>{
    const result=uploadService.uploadAvatar(req.file);
    res.status(200)
    .json(
        new ApiResponse(200,result,"Avatar uploaded")
    );
});
