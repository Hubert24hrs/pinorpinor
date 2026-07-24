import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Server-side Zod validation (includes 18+ check)
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { displayName, email, password, gender, interestedIn, birthDate } = parsed.data;

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Generate unique username
    const base = displayName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
    const suffix = Math.random().toString(36).slice(2, 6);
    const username = `${base}${suffix}`;

    // Hash password with bcrypt (cost 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Determine UserRole from gender
    const role = gender === "WOMAN" ? "WOMAN" : "MAN";

    // Create user + DatingProfile + Settings atomically
    const user = await prisma.user.create({
      data: {
        email,
        displayName,
        username,
        passwordHash,
        role,
        gender,
        interestedIn,
        birthDate: new Date(birthDate),
        datingProfile: {
          create: {
            isPublic: true,
            isDiscoverable: true,
          },
        },
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        username: true,
        role: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error("register error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
