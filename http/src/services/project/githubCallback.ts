// @ts-nocheck
import axios from "axios";
import { Request, Response } from "express";
import prisma from "../../prismaClient";
import jwt from 'jsonwebtoken';

const githubCallback = async (req: Request, res: Response) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.AUTH_GITHUB_SECRET,
            code,
            redirect_uri: process.env.GITHUB_CALLBACK_URL,
            scope: 'admin:repo_hook'
        }, {
            headers: { 
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const githubUser = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const email = githubUser.data.email || `${githubUser.data.login}@github.com`;

        const userName = githubUser.data.login;

        const result = await prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({
                where: { githubUsername: userName }
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found. Please register first.' });
            }

            const updatedUser = await tx.user.update({
                where: { githubUsername: userName },
                data: {
                    // githubUsername: githubUser.data.login,
                    githubAccessToken: accessToken,
                    githubProfileUrl: githubUser.data.html_url,
                    githubAvatarUrl: githubUser.data.avatar_url,
                }
            });

            const pendingUsers = await tx.pendingProjectUser.findMany({
                where: { githubUsername: githubUser.data.login }
            });

            for (const pendingUser of pendingUsers) {
                await tx.projectUser.create({
                    data: {
                        userId: updatedUser.id,
                        projectId: pendingUser.projectId,
                        role: pendingUser.role
                    }
                });

                await tx.pendingProjectUser.delete({
                    where: { id: pendingUser.id }
                });
            }

            return {
                user: updatedUser,
                convertedCount: pendingUsers.length
            };
        });

        console.log(`GitHub linked successfully. Converted ${result.convertedCount} pending project memberships.`);

        const token = jwt.sign({ userId: result.user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

        res.json({ 
            token, 
            user: result.user,
            convertedProjects: result.convertedCount
        });
    } catch (error) {
        console.error('GitHub OAuth Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    } finally {
        await prisma.$disconnect();
    }
};

export default githubCallback;