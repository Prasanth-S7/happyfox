//@ts-nocheck
import express from "express";
import { Request, Response } from "express";
import prisma from "../../prismaClient";
import { loginMiddleware } from "../../middlewares/login";
import { upload } from "../../controllers/eventController";

export const postRouter = express.Router();

postRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: {
              username: true,
              id: true,
            },
          },
          forum: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.post.count(),
    ]);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

postRouter.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            id: true,
          },
        },
        forum: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

postRouter.post(
  "/create",
  loginMiddleware,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { title, content, forumId, tags, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      if (!title || !content || !forumId) {
        return res
          .status(400)
          .json({ message: "Title, content, and forum ID are required" });
      }

      const forum = await prisma.forum.findUnique({
        where: { id: Number(forumId) },
      });
      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          forumId: Number(forumId),
          category,
          imageUrl: image,
          authorId: req.user!.id,
          tags: tags ? tags.split(",") : [],
        },
        include: {
          author: { select: { username: true, id: true } },
          forum: { select: { name: true, id: true } },
        },
      });

      res.status(201).json(post);
    } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ message: "Failed to create post" });
    }
  }
);

postRouter.post(
  "/update",
  loginMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { title, content, forumId } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      if (!title && !content && !forumId) {
        return res.status(400).json({ message: "Nothing to update" });
      }

      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.authorId !== req.user!.id && req.user!.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Not authorized to update this post" });
      }

      const forum = await prisma.forum.findUnique({
        where: { id: forumId },
      });

      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title: title || undefined,
          content: content || undefined,
          forumId: forumId || undefined,
        },
        include: {
          author: {
            select: {
              username: true,
              id: true,
            },
          },
          forum: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });

      res.status(200).json(updatedPost);
    } catch (err) {
      console.error("Error updating post:", err);
      res.status(500).json({ message: "Failed to update post" });
    }
  }
);

postRouter.post(
  "/delete",
  loginMiddleware,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.authorId !== req.user!.id && req.user!.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this post" });
      }

      await prisma.post.delete({
        where: { id },
      });

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ message: "Failed to delete post" });
    }
  }
);

// Get all posts in a forum
postRouter.get("/all/:id", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const id = Number(req.params.id);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          forumId: id,
        },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              username: true,
              id: true,
            },
          },
          forum: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.post.count(),
    ]);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

postRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            id: true,
          },
        },
        forum: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

postRouter.post("/upvote", loginMiddleware, async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const existingVotes = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        votes: existingVotes?.votes + 1,
      },
    });
    if (post) {
      return res.status(201).json({
        msg: "Voting successfull",
      });
    } else {
      return res.status(400).json({
        msg: "voting unsuccessfull due to some error",
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});

postRouter.post("/downvote", loginMiddleware, async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const existingVotes = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    const res = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        votes: existingVotes?.votes - 1,
      },
    });
    if (res) {
      return res.status(201).json({
        msg: "Voting successfull",
      });
    } else {
      return res.status(400).json({
        msg: "voting unsuccessfull due to some error",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});
