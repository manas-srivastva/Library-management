import jwt from "jsonwebtoken";

const generateToken = (user) => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT secret is not configured");
    }

    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        jwtSecret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            issuer: "libraai",
        }
    );
};

export default generateToken;