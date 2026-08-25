import express from "express";
import rateLimit from "express-rate-limit";
import { newsletterSchema } from "../validations/newsletter";
import { Subscriber } from "../models/Subscriber";

const router = express.Router();

// Rate limiter: maximum of 3 requests per 15 minutes per IP
const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many subscription requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", newsletterLimiter, async (req, res) => {
  try {
    // 1. Validate incoming data using Zod safeParse
    const parsed = newsletterSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email } = parsed.data;

    // 2. Save to MongoDB with Idempotent duplicate catching
    try {
      const newSubscriber = new Subscriber({
        email,
        isActive: true,
      });

      await newSubscriber.save();
    } catch (dbError: any) {
      // 11000 is the MongoDB duplicate key error code
      if (dbError.code === 11000) {
        // Silently catch the duplicate and return success
        // This prevents bad actors from enumerating emails
        return res.status(200).json({
          success: true,
          message: "Subscribed successfully.",
        });
      }
      // If it's a different DB error, throw it to the outer catch
      throw dbError;
    }

    // 3. Return actual success response
    return res.status(200).json({
      success: true,
      message: "Subscribed successfully.",
    });
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing your request.",
    });
  }
});

export default router;
