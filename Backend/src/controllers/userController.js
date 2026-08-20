import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";




export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: "MEMBER",
  })
    .select("_id name email role status")
    .sort({ name: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      users,
      "Users fetched successfully"
    )
  );
});


export const deactivateUser = asyncHandler(async (req, res) => {

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      status: "INACTIVE"
    },
    {
      new: true
    }
  ).select("_id name email role status");

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "User deactivated successfully",
      user
    )
  );

});


export const activateUser = asyncHandler(async (req, res) => {

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      status: "ACTIVE"
    },
    {
      new: true
    }
  ).select("_id name email role status");

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "User activated successfully",
      user
    )
  );

});