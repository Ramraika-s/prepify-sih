import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  topic: z.enum([
    "General Inquiry",
    "Technical Support",
    "Institute Partnership",
    "Billing & Subscriptions",
  ], {
    required_error: "Please select a valid topic",
    invalid_type_error: "Please select a valid topic",
  }),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
