import jwt from "jsonwebtoken";

import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";

const authMiddleware =

    async (

        req,

        res,

        next

    ) => {

        let token;

        const authHeader =

            req.headers.authorization;


        if (

            authHeader &&

            authHeader.startsWith(

                "Bearer "

            )

        ) {

            token =

                authHeader.split(

                    " "

                )[1];

        }


        if (

            !token

        ) {

            return next(

                new ApiError(

                    401,

                    "Unauthorized"

                )

            );

        }


        try {

            const decoded =

                jwt.verify(

                    token,

                    process.env.JWT_SECRET

                );


            const user =

                await User.findById(

                    decoded.id

                )

                    .select(

                        "-password"

                    );


            if (

                !user) {

                throw new ApiError(

                    404,

                    "User not found"

                );

            }


            req.user = user;

            next();

        }

        catch (error) {

            next(

                new ApiError(

                    401,

                    "Invalid Token"

                )

            );

        }

    };

export default authMiddleware;