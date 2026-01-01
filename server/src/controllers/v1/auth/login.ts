import { IUser } from "@/models/user";
import { Request, Response } from "express";
import User from "@/models/user"; 
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import Token from "@/models/token";
import { logger } from "@/lib/winston";
import config from "@/config";

type UserData = Pick<IUser, 'email' | 'password'> 

const login = async (req: Request, res: Response): Promise<void> => {
    try { 
        const { email } = req.body as UserData; 
        const user = await User.findOne({ email })
            .select('username email password role')
            .lean()
            .exec();

        if (!user) { 
            res.status(404).json({
                code: "Not Found", 
                message: 'User with this email does not exist.'
            }); 
            return; 
        }
        // Generate access token and refresh token for new user 
        const accessToken = generateAccessToken(user._id); 
        const refreshToken = generateRefreshToken(user._id); 

        // Store refresh token in db 
        await Token.create({
            token: refreshToken, 
            userId: user._id 
        }); 
        logger.info('Refresh token created for user', {
            userId: user._id, 
            token: refreshToken 
        });

        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true, 
            secure: config.NODE_ENV === 'production', 
            sameSite: 'strict'
        }); 

        res.status(201).json({ 
            user: { 
                user: user.username, 
                email: user.email, 
                role: user.role
            }, 
            accessToken
        }); 

        logger.info('User registered successfully', user); 
    } catch (error) { 
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Internal Server Error'
        }); 

        logger.error('Error during user login', error); 
    }
} 

export default login; 