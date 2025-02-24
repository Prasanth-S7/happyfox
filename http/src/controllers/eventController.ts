// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import fs from 'fs'
import path from "path";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'));
    }
};
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export const createEvent = async (req: Request, res: Response) => {
    try {
        const {
            title,
            by,
            date,
            link,
            description,
            category
        } = req.body;

        const avatarPath = req.files['avatar'][0].path;
        const posterPath = req.files['poster'][0].path;

        const event = await prisma.event.create({
            data: {
                title,
                by: by,
                avatar: avatarPath,
                date: date,
                link: link,
                description: description,
                category: category,
                poster: posterPath
            }
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event'
        });
    }
};


export const getEvents = async (req: Request, res: Response) => {
    const events = await prisma.event.findMany();
    
    res.status(200).json({
        success: true,
        data: events
    });
}