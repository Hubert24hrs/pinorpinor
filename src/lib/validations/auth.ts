import { z } from "zod";

// ── Register ─────────────────────────────────────────────────
export const registerSchema = z.object({
  displayName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  gender: z.enum(["MAN", "WOMAN"]),
  interestedIn: z.enum(["MAN", "WOMAN"]),
  birthDate: z.string().refine((val) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    const adjustedAge = m < 0 || (m === 0 && today.getDate() < date.getDate()) ? age - 1 : age;
    return adjustedAge >= 18;
  }, { message: "You must be 18 or older to join." }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ── Login ────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ── Forgot Password ───────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

// ── Reset Password ────────────────────────────────────────────
export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100),
});
