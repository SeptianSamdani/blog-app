import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"; 
import { logger } from "@/lib/winston"; 
import Token from "@/models/token"; 
import type { Request, Response } from 'express'; 
import { Types } from "mongoose"; 
import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";

const refreshToken = async (req: Request, res: Response) => { 
    const refreshToken = req.cookies.refreshToken as string; 

    try { 
        const tokenExists = await Token.exists({ token: refreshToken }); 

        if (!tokenExists) { 
            res.status(401).json({
                code: 'Authentication Error', 
                message: 'Invalid refresh token'
            }); 

            return; 
        }

        // Verify refresh token 
        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId }; 

        const accessToken = generateAccessToken(jwtPayload.userId); 

        res.status(200).json({
            accessToken
        })
    } catch (error) { 
        if (error instanceof TokenExpiredError) { 
            res.status(401).json({ 
                message: error instanceof Error ? error.message : 'Refresh token expired, please login again.'
            }); 

            return; 
        }

        if (error instanceof JsonWebTokenError) { 
            res.status(401).json({ 
                message: error instanceof Error ? error.message : 'Invalid refresh token.'
            }); 

            return; 
        }
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Internal Server Error'
        }); 

        logger.error('Error during user registration', error); 
    }
}

export default refreshToken; 