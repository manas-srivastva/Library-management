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
      status: "INACTIVE",
    },
    {
      new: true,
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
      user,
      "User deactivated successfully"
    )
  );
});

export const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      status: "ACTIVE",
    },
    {
      new: true,
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
      user,
      "User activated successfully"
    )
  );
});


export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      phone,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("_id name email role status phone profileImage");

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Profile updated successfully"
    )
  );
});


export const changePassword = asyncHandler(async (req, res) => {
  const {
    currentPassword,
    newPassword,
  } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(
      400,
      "Current password and new password are required"
    );
  }

  const user = await User.findById(
    req.user._id
  ).select("+password");

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  const isPasswordCorrect =
    await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(
      400,
      "Current password is incorrect"
    );
  }

  user.password = newPassword;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Password updated successfully"
    )
  );
});