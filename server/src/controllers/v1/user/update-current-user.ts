import { logger } from "@/lib/winston";
import { Request, Response } from "express";
import User from '@/models/user';


const updateCurrentUser = async (req: Request, res: Response): Promise<void> => { 
    const userId = req.userId; 

    const {
        username, 
        email, 
        password, 
        first_name, 
        last_name, 
        website, 
        tiktok, 
        instagram, 
    } = req.body; 

    try { 
        const user = await User.findById(userId).select('+password -__v').exec(); 

        if (!user) {
            res.status(404).json({
                code: 'Not Found', 
                message: 'User not found'
            }); 

            return; 
        }

        if (username) user.username = username; 
        if (email) user.email = email; 
        if (password) user.password = password; 
        if (first_name) user.firstName = first_name; 
        if (last_name) user.lastName = last_name; 
        if (!user.socialLinks) {
            user.socialLinks = {}; 
        }
        if (website) user.socialLinks.website = website; 
        if (tiktok) user.socialLinks.tiktok = tiktok; 
        if (instagram) user.socialLinks.instagram = instagram; 

        await user.save(); 

        logger.info('User update successfully', user); 

        res.status(200).json({
            user
        }); 
        
    } catch (error) { 
        res.status(500).json({
            code: 'Server Error', 
            message: 'Internal server error', 
            error: error
        })

        logger.error('Error while getting current user', error); 
    }
}

export default updateCurrentUser; 