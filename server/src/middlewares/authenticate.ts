import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

import type { Request, Response, NextFunction } from 'express'; 
import type { Types } from "mongoose";

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization; 

    if (!authHeader?.startsWith('Bearer ')) { 
        res.status(401).json({ 
            code: 'Authentication Error', 
            message: 'Access denied. No token provided'
        }); 

        return; 
    }

    // Split out the token from the "Bearer <token>" prefix
    const [_, token] = authHeader.split(' '); 

    try {
        // Verify the token and extract the userId from the payload 
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId }; 

        // Attach the userId to the request object for later use
        req.userId = jwtPayload.userId; 

        return next(); 
    } catch (error) {
        // Handle expired token error 
        if (error instanceof TokenExpiredError) { 
            res.status(401).json({
                code: 'Authentication Error', 
                message: 'Access token expired, request a new one with refresh token.'
            }); 

            return; 
        }

        // Handle invalid token error 
        if (error instanceof JsonWebTokenError) { 
            res.status(401).json({
                code: 'Authentication Error', 
                message: 'Access token invalid'
            }); 

            return; 
        }

        // Catch all for other errors 
        res.status(500).json({
            code: 'Server Error', 
            message: 'Internal server error', 
            error: error 
        }); 

        logger.error('Error during authentication', error); 
    }
}

export default authenticate; 