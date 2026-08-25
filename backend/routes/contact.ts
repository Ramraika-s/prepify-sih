import express from "express";
import rateLimit from "express-rate-limit";
import { contactSchema } from "../validations/contact";
import { ContactMessage } from "../models/ContactMessage";

const router = express.Router();

// Rate limiter: maximum of 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many contact requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", contactLimiter, async (req, res) => {
  try {
    // 1. Validate incoming data using Zod safeParse
    const parsed = contactSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    // 2. Extract validated data
    const { firstName, lastName, email, topic, message } = parsed.data;

    // 3. Save to MongoDB
    const newMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      topic,
      message,
    });

    await newMessage.save();

    // 4. Return success response
    return res.status(200).json({
      success: true,
      message: "Message received successfully.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing your request.",
    });
  }
});

export default router;
