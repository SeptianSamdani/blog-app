import getCurrentUser from "@/controllers/v1/user/get-current-user";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import { Router } from "express"; 
import { param, body, query } from "express-validator"; 

const router = Router();

router.get(
    '/current', 
    authenticate, 
    authorize(['admin', 'user']), 
    getCurrentUser
)

export default router;