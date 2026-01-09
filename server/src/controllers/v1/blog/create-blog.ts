import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom';
import { logger } from "@/lib/winston";
import { Request, Response } from "express";
import type { IBlog } from "@/models/blog";
import Blog from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>

const window = new JSDOM('').window; 
const purify = DOMPurify(window); 

const createBlog = async (req: Request, res: Response): Promise<void> => {
    try { 
        const  { title, content, banner, status } = req.body as BlogData; 
        const userId = req.userId; 

        const cleanContent = purify.sanitize(content); 

        const newBlog = await Blog.create({
            title, 
            content: cleanContent, 
            banner, 
            status, 
            author: userId
        }); 

        logger.info('New blog created', newBlog); 

        res.status(201).json({
            blog: newBlog
        }); 

    } catch (error) { 
        res.status(500).json({
            code: 'Server Error', 
            message: 'Internal server error', 
            error: error
        })

        logger.error('Error while creating a blog.', error);
    }
}

export default createBlog; 