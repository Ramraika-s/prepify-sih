import { z } from "zod";

export type ActionResponse<T = undefined> = 
  | { success: true; data: T }
  | { success: false; error: string; validationErrors?: z.ZodIssue[] };
