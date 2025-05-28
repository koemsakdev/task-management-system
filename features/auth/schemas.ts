import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain at least one letter, one number, and one special character"
    )
    .regex(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    ),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain at least one letter, one number, and one special character"
    )
    .regex(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    ),
});
