// @ts-nocheck
import { Router } from "express";
import { userGithubDetails } from "./user";
import githubCallback from "./githubCallback";
import { authenticate } from "../../middlewares/auth";
import prisma from "../../prismaClient";
import axios from "axios";

const projectRouter = Router();

projectRouter.get('/user', userGithubDetails);
projectRouter.get('/callback', githubCallback);

projectRouter.get('/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

projectRouter.get('/user/projects', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const projects = await prisma.project.findMany({
            where: {
                users: {
                    some: {
                        userId: userId
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(projects);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ error: 'Failed to fetch user projects' });
    }
});

projectRouter.get('/github/repositories', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { githubAccessToken: true, githubUsername: true }
        });

        if (!user?.githubAccessToken) {
            return res.status(400).json({ error: 'GitHub account not connected' });
        }

        const response = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                'Authorization': `token ${user.githubAccessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const existingProjects = await prisma.project.findMany({
            where: {
                users: {
                    some: {
                        userId: userId
                    }
                }
            },
            select: {
                githubUrl: true
            }
        });

        const existingRepoUrls = new Set(existingProjects.map(p => p.githubUrl));
        const availableRepos = response.data.filter(repo => !existingRepoUrls.has(repo.html_url));

        res.json(availableRepos);
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
});

projectRouter.post('/projects/import-github', authenticate, async (req, res) => {
    const { repositoryId } = req.body;
    const userId = req.user.id;

    if (!repositoryId) {
        return res.status(400).json({ error: 'Repository ID is required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.githubAccessToken) {
            return res.status(400).json({ error: 'GitHub account not connected' });
        }

        const repoResponse = await axios.get(`https://api.github.com/repositories/${repositoryId}`, {
            headers: {
                'Authorization': `token ${user.githubAccessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const repo = repoResponse.data;

        const languagesResponse = await axios.get(repo.languages_url, {
            headers: {
                'Authorization': `token ${user.githubAccessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const languages = languagesResponse.data;
        const techStack = Object.keys(languages);

        const counter = await prisma.counter.update({
            where: { id: 'project_counter' },
            data: { count: { increment: 1 } },
            select: { count: true }
        });

        const newProject = await prisma.project.create({
            data: {
                id: `P${counter.count.toString().padStart(5, '0')}`,
                name: repo.name,
                description: repo.description || '',
                problemStatement: '',
                githubUrl: repo.html_url,
                techStack,
                status: 'ONGOING',
                projectType: 'PERSONAL',
                keyFeatures: [],
                users: {
                    create: {
                        userId: user.id,
                        role: 'OWNER'
                    }
                }
            }
        });

        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error importing GitHub repository:', error);
        res.status(500).json({ error: 'Failed to import repository' });
    }
});

projectRouter.get('/auth/me', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                githubUsername: true,
                githubProfileUrl: true,
                githubAvatarUrl: true,
                techStack: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user information' });
    }
});


export default projectRouter;