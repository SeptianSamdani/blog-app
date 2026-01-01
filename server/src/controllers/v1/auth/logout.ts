import { IUser } from "@/models/user";
import { Request, Response } from "express";
import User from "@/models/user"; 
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import Token from "@/models/token";
import { logger } from "@/lib/winston";
import config from "@/config";


const logout = async (req: Request, res: Response): Promise<void> => {
    try { 
        const refreshToken = req.cookies.refreshToken as string; 

        if (refreshToken) { 
            await Token.deleteOne({ token: refreshToken }); 

            logger.info('User refresh token deleted successfully', {
                userId: req.userId, 
                token: refreshToken 
            }); 
        }

        res.clearCookie('refreshToken', {
            httpOnly: true, 
            secure: config.NODE_ENV === 'production', 
            sameSite: 'strict'
        }); 

        res.sendStatus(204); 

        logger.info('User logged out successfully', {
            userId: req.userId
        }); 
    } catch (error) { 
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Internal Server Error'
        }); 

        logger.error('Error during user logout', error); 
    }
} 

export default logout; 