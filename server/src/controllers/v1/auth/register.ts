
import { Request, Response } from "express";

import User from "@/models/user"; 
import Token from "@/models/token";

import type { IUser } from "@/models/user";
import { genUsername } from "@/utils";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import config from "@/config";
import { logger } from "@/lib/winston";


type UserData = Pick<IUser, 'email' | 'password' | 'role'>

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData; 

    if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
        res.status(403).json({
            code: 'Authorization Error', 
            message: "You cannot register as an admin."
        }); 

        logger.warn(
            `User with email ${email} tried to register as admin but is not whitelisted.`
        ); 

        return; 
    }

    try { 
        const username = genUsername(); 
        const newUser = await User.create({
            username, 
            email, 
            password, 
            role 
        }); 

        // Generate access token and refresh token for new user 
        const accessToken = generateAccessToken(newUser._id); 
        const refreshToken = generateRefreshToken(newUser._id); 

        // Store refresh token in db 
        await Token.create({
            token: refreshToken, 
            userId: newUser._id 
        }); 
        logger.info('Refresh token created for user', {
            userId: newUser._id, 
            token: refreshToken 
        });

        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true, 
            secure: config.NODE_ENV === 'production', 
            sameSite: 'strict'
        }); 

        res.status(201).json({ 
            user: { 
                user: newUser.username, 
                email: newUser.email, 
                role: newUser.role
            }, 
            accessToken
        }); 

        logger.info('User registered successfully', {
            user: newUser.username, 
            email: newUser.email, 
            role: newUser.role
        }); 
    } catch (error) { 
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'Internal Server Error'
        }); 

        logger.error('Error during user registration', error); 
    }
}

export default register; 