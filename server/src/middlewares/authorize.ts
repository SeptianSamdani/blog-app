import type { Request, Response, NextFunction } from 'express'; 
import User from "@/models/user"; 
import { logger } from '@/lib/winston';

export type AuthRole = 'admin' | 'user'; 

const authorize = (roles: AuthRole[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId; 

        try {
            const user = await User.findById(userId).select('role').exec(); 

            if (!user) { 
                res.status(404).json({
                    code: 'Not Found', 
                    message: 'User not found'
                }); 

                return; 
            }

            if (!roles.includes(user.role)) { 
                res.status(403).json({
                    code: 'Authorization Error', 
                    message: 'Access Denied'
                }); 

                return; 
            }

            return next(); 
        } catch (error) { 
            res.status(500).json({
                code: 'Server Error', 
                message: 'Internal server error', 
                error: error
            })

            logger.error('Error while authorizing user', error); 
        }
    }
}

export default authorize;