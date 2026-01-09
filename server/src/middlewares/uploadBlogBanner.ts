import uploadToCloudinary from "@/lib/cloudinary";
import { logger } from "@/lib/winston";
import { UploadApiErrorResponse } from "cloudinary";
import { Request, Response, NextFunction} from "express";



const MAX_FILE_SIZE = 2 * 1024 * 1024; 

const uploadBlogBanner = (method: 'post' | 'put') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (method === 'put' && !req.file) {
            next(); 
            return; 
        }

        if (!req.file) {
            res.status(400).json({
                code: 'Validation Error', 
                message: 'Blog banner is required'
            }); 
            return; 
        }

        if (req.file.size > MAX_FILE_SIZE) {
            res.status(413).json({
                code: 'Validation Error', 
                message: 'File size must be less than 2MB'
            }); 
            return; 
        }

        try { 
            const { blogId } = req.params; 

            const data = await uploadToCloudinary(
                req.file.buffer, 
                
            ); 

            if (!data) {
                res.status(500).json({
                    code: 'Server Error', 
                    message: 'Internal Server Error'
                }); 

                logger.error('Error while uploading blog banner to cloudinary', {

                }); 
                return; 
            }

            const newBanner = {
                publicId: data.public_id, 
                url: data.url, 
                width: data.url, 
                height: data.height
            }; 

            logger.info('Blog banner uploaded to Cloudinary', {
                
            }); 

            req.body.banner = newBanner; 

            next(); 
        } catch(error: UploadApiErrorResponse | any) {
            res.status(error.http_code).json({
                code: error.http_code < 500 ? 'Validation Error' : error.name, 
                message: error.message 
            }); 

            logger.error('Error while uploading blog banner to Cloudinary', error); 
        }
    }
}

export default uploadBlogBanner;