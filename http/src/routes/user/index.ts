//@ts-nocheck
import express from "express";
import { Request, Response } from "express";
import prisma from "../../prismaClient";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { loginMiddleware } from "../../middlewares/login";

export const userRouter = express.Router();

// Input validation helper
function validateInput(data: any) {
  const { username, firstName, lastName, email, password } = data;
  if (!email?.includes('@') || !password || password.length < 6) {
    return false;
  }
  return true;
}

// Signup route
userRouter.post("/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    if (!validateInput(req.body)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Check if user exists (both username and email)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(403).json({ 
        message: existingUser.username === username 
          ? "Username already exists" 
          : "Email already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "USER",
        xp: 0,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        xp: true,
        createdAt: true,
      }
    });

    const token = sign(
      { id: user.id }, 
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.cookie("token", `${token}`, {
      httpOnly: false,  // Important for security
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
userRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
        xp: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = sign(
      { id: user.id }, 
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.cookie("token", `${token}`, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout route
userRouter.post("/logout", (_req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      expires: new Date(0)
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/self", loginMiddleware, (req: Request, res: Response) => {
  return res.status(200).json(req.user); 
})