import { logger } from "@/lib/winston";
import { Request, Response } from "express";
import User from '@/models/user';


const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    try { 
        await User.deleteOne({ _id: userId }); 
        logger.info('User account has been deleted.', {
            userId
        }); 

        res.sendStatus(204).json({
            userId
        })
    } catch (error) { 
        res.status(500).json({
            code: 'Server Error', 
            message: 'Internal server error', 
            error: error
        })

        logger.error('Error while deleting current user', error); 
    }
}

export default deleteUser;