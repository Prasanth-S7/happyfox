//@ts-nocheck
import express from "express";
import { Request, Response } from "express";
import prisma from "../../prismaClient";
import { loginMiddleware } from "../../middlewares/login";

export const sessionRouter = express.Router();

sessionRouter.get("/all/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [sessions, total] = await Promise.all([
            prisma.session.findMany({
                where: {
                    forumId: id
                },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            username: true,
                            id: true
                        }
                    },
                    forum: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma.session.count()
        ]);

        res.status(200).json({
            sessions,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error("Error fetching sessions:", err);
        res.status(500).json({ message: "Failed to fetch sessions" });
    }
});

sessionRouter.get("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid session ID" });
        }

        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        username: true,
                        id: true
                    }
                },
                forum: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.status(200).json(session);
    } catch (err) {
        console.error("Error fetching session:", err);
        res.status(500).json({ message: "Failed to fetch session" });
    }
});

sessionRouter.post("/create", loginMiddleware, async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, description, category, joiningLink, forumId } = req.body;

        if (!title || !description || !category || !joiningLink) {
            return res.status(400).json({ message: "Title, description, category, and joining link are required" });
        }

        const forum = await prisma.forum.findUnique({
            where: { id: Number(forumId) }
        });

        if (!forum) {
            return res.status(404).json({ message: "Forum not found" });
        }

        const session = await prisma.session.create({
            data: {
                title,
                description,
                category,
                joiningLink,
                forumId: Number(forumId),
                userId: req.user.id
            },
            include: {
                user: {
                    select: {
                        username: true,
                        id: true
                    }
                },
                forum: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });

        res.status(201).json(session);
    } catch (err) {
        console.error("Error creating session:", err);
        res.status(500).json({ message: "Failed to create session" });
    }
});


sessionRouter.delete("/:id", loginMiddleware, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid session ID" });
        }

        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        username: true,
                        id: true
                    }
                },
                forum: {
                    select: {
                        name: true,
                        id: true
                    }
                },
            }
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.status(200).json(session);
    } catch (err) {
        console.error("Error fetching session:", err);
        res.status(500).json({ message: "Failed to fetch session" });
    }
});
