import createBlog from "@/controllers/v1/blog/create-blog";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";
import { Router } from "express";
import multer from "multer";
import { body } from "express-validator";
import validationError from "@/middlewares/validationError";

const upload = multer();
const router = Router();

router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    uploadBlogBanner('post'),

    // ===== VALIDATION =====
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 180 })
        .withMessage('Title must be less than 180 characters'),

    body('slug')
        .trim()
        .notEmpty()
        .withMessage('Slug is required')
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Slug must be lowercase and kebab-case'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 20 })
        .withMessage('Content must be at least 20 characters'),

    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be draft or published'),
    
    body('banner_image')
        .notEmpty()
        .withMessage('Banner image is required'), 

    validationError,
    createBlog
);

export default router;
