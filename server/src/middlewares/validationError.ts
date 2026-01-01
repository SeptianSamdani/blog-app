import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";


const validationError = (req: Request, res: Response, next: NextFunction) => { 
    const errors = validationResult(req); 

    if (!errors.isEmpty()) { 
        res.status(400).json({
            code: 'Validation Error', 
            errors: errors.mapped(), 
        }); 

        return; 
    }

    next(); 
}

export default validationError; 