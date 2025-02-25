import { Request, Response } from "express";
import prisma from "../../prismaClient";
import jwt, {decode, verify} from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const userGithubDetails = async (req: Request, res: Response) => {
    try {
        const token = req.headers.cookie?.split("token=")[1];
        if(!token) {
            res.status(400).json({
                message: "Bad request"
            })
        }
        // @ts-ignore
        const decodedData = verify(token, JWT_SECRET);
        const id = decodedData.id;
        const userDetail = await prisma.user.findUnique({
            where: {
                id: id
            },
        select: {
                githubAccessToken: true,
                githubAvatarUrl: true,
                githubProfileUrl: true,
                githubUsername: true,
                techStack: true,
                projects: true
            }
        })

        if(!userDetail) {
            res.status(404).json({
                message: "User not found!"
            })
        }

        res.status(200).json({
            data: userDetail,
            message: "User data found"
        })
    } catch (error) {
        console.error(error);   
    }
}

export {
    userGithubDetails
}