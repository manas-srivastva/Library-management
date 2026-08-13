import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: "MEMBER",
    status: "ACTIVE",
  })
    .select("_id name email role status")
    .sort({ name: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      
      "Users fetched successfully",
      users
    )
  );
});