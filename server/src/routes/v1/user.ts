import getCurrentUser from "@/controllers/v1/user/get-current-user";
import updateCurrentUser from "@/controllers/v1/user/update-current-user";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { Router } from "express"; 
import { param, body, query } from "express-validator"; 
import User from '@/models/user';
import validationError from "@/middlewares/validationError";
import deleteCurrentUser from "@/controllers/v1/user/delete-current-user";

const router = Router();

router.get(
    '/current', 
    authenticate, 
    authorize(['admin', 'user']), 
    getCurrentUser
); 

router.put(
    '/current', 
    authenticate, 
    authorize(['admin', 'user']), 
    body('username')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Username must be less than 20 characters')
        .custom(async (value) => {
            const userExists = await User.exists({ username: value }); 

            if (userExists) {
                throw Error('This username is already in use')
            }
        }),
    body('email')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value }); 

            if (userExists) {
                throw Error('This email is already in use')
            }
        }),
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'), 
    body('first_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('First Name must be less than 20 characters'), 
    body('last_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Last Name must be less than 20 characters'), 
    body(['website', 'instagram', 'tiktok'])
        .optional()
        .isURL()
        .withMessage('Invalid URL')
        .isLength({ max: 100 })
        .withMessage('URL must be less than 100 characters'), 
    validationError,
    updateCurrentUser
); 

router.delete(
    '/current', 
    authenticate, 
    authorize(['admin', 'user']), 
    deleteCurrentUser
); 

export default router;