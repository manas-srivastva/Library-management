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


export const updateMyProfile = asyncHandler(
  async (req, res) => {
    const { name, phone, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    const updatedUser = await User.findById(
      user._id
    ).select(
      "_id name email role status phone profileImage"
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Profile updated successfully"
      )
    );
  }
);