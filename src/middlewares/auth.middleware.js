import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log(token);
        
        if (!token) {
            throw new ApiError(401, "unauthorized access!!")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken);
           if(!decodedToken){
            throw new ApiError(404,"invalid access token")
           }
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        console.log(user);
        
        if(!user){
            throw new ApiError(401,"invalid access token");
        }
        req.user = user;
        

        next();
    } catch (error) {
        throw new ApiError(500 ,'something went wrong');
    }

})

// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import jwt from "jsonwebtoken";

// export const verifyJWT = asyncHandler(async (req, _, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
//         console.log('Token:', token);

//         if (!token) {
//             console.error('No token found in the request');
//             throw new ApiError(401, "Unauthorized access!");
//         }

//         let decodedToken;
//         try {
//             decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         } catch (err) {
//             console.error('JWT Verification Error:', err);
//             throw new ApiError(401, "Invalid access token");
//         }

//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
//         if (!user) {
//             console.error('User not found for ID:', decodedToken?._id);
//             throw new ApiError(401, "Invalid access token");
//         }
        
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Middleware Error:', error);
//         throw new ApiError(500, 'Something went wrong');
//     }
// });
