import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Zod Schemas
const loginSchema = z.object({
  role: z.enum(["student", "institute", "mentor"]),
  identifier: z.string().min(1, "Identifier or email is required"),
  password: z.string().min(1, "Password is required"),
});

const registerStudentSchema = z.object({
  role: z.literal("student"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  targetExam: z.string().min(1, "Target exam selection is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerInstituteSchema = z.object({
  role: z.literal("institute"),
  instituteName: z.string().min(2, "Institute name must be at least 2 characters"),
  email: z.string().email("Invalid work email address"),
  batchSize: z.string().min(1, "Batch size is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerMentorSchema = z.object({
  role: z.literal("mentor"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  specialty: z.string().min(1, "Specialty selection is required"),
  email: z.string().email("Invalid work email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Helper for cookie & token
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  };

  res.cookie("prepify_token", token, cookieOptions).status(statusCode).json({
    message: "Success",
    token: token,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      targetExam: user.targetExam,
      instituteName: user.instituteName,
      batchSize: user.batchSize,
      specialty: user.specialty,
    },
  });
};

// @route   POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const role = req.body.role;
    let validatedData: any;

    if (role === "student") {
      const result = registerStudentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0]?.message || "Invalid input" });
      }
      validatedData = result.data;
    } else if (role === "institute") {
      const result = registerInstituteSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0]?.message || "Invalid input" });
      }
      validatedData = result.data;
    } else if (role === "mentor") {
      const result = registerMentorSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0]?.message || "Invalid input" });
      }
      validatedData = result.data;
    } else {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email address already exists" });
    }

    const newUser = await User.create({
      role: validatedData.role,
      email: validatedData.email,
      password: validatedData.password,
      fullName: validatedData.fullName,
      targetExam: validatedData.targetExam,
      instituteName: validatedData.instituteName,
      batchSize: validatedData.batchSize,
      specialty: validatedData.specialty,
    });

    sendTokenResponse(newUser, 201, res);
  } catch (error: any) {
    console.error("Express Register Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during registration" });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.issues[0]?.message || "Invalid input" });
    }

    const { role, identifier, password } = parseResult.data;

    const user = await User.findOne({ email: identifier.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(401).json({ error: `This account is registered as a ${user.role}.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    console.error("Express Login Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error during login" });
  }
});

// @route   GET /api/auth/me
router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.prepify_token;
    if (!token) {
      return res.status(401).json({ authenticated: false, user: null });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ authenticated: false, user: null });
    }

    res.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        targetExam: user.targetExam,
        instituteName: user.instituteName,
        batchSize: user.batchSize,
        specialty: user.specialty,
      },
    });
  } catch (error) {
    res.status(401).json({ authenticated: false, user: null });
  }
});

// @route   POST /api/auth/logout
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("prepify_token", "", {
    expires: new Date(0),
    httpOnly: true,
  }).json({ message: "Logged out successfully" });
});

export default router;
