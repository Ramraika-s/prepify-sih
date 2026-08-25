import { z } from "zod";

export const loginSchema = z.object({
  role: z.enum(["student", "institute", "mentor"]),
  identifier: z.string().min(1, "Identifier or email is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerStudentSchema = z.object({
  role: z.literal("student"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  targetExam: z.string().min(1, "Target exam selection is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerInstituteSchema = z.object({
  role: z.literal("institute"),
  instituteName: z.string().min(2, "Institute name must be at least 2 characters"),
  email: z.string().email("Invalid work email address"),
  batchSize: z.string().min(1, "Batch size is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerMentorSchema = z.object({
  role: z.literal("mentor"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  specialty: z.string().min(1, "Specialty selection is required"),
  email: z.string().email("Invalid work email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
export type RegisterInstituteInput = z.infer<typeof registerInstituteSchema>;
export type RegisterMentorInput = z.infer<typeof registerMentorSchema>;
