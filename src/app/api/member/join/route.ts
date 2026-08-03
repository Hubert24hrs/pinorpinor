import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      displayName,
      username,
      birthDate,
      gender,
      city,
      country,
      bio,
      tagline,
      dateTypes,
    } = body;

    // 1. Mandatory server-side gender enforcement
    if (gender !== "WOMAN") {
      return NextResponse.json(
        { error: "Pinorpinor public profiles are currently restricted to adult women only." },
        { status: 400 }
      );
    }

    // 2. Mandatory server-side 18+ age validation
    if (!birthDate) {
      return NextResponse.json({ error: "Date of birth is required." }, { status: 400 });
    }

    const dob = new Date(birthDate);
    if (isNaN(dob.getTime())) {
      return NextResponse.json({ error: "Invalid date of birth format." }, { status: 400 });
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

    if (age < 18) {
      return NextResponse.json(
        { error: "You must be at least 18 years old to create a profile on Pinorpinor." },
        { status: 400 }
      );
    }

    // 3. Email & Username duplicate checks
    if (!email || !password || !displayName || !username) {
      return NextResponse.json({ error: "Missing required account fields." }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ error: "This username is already taken. Please choose another." }, { status: 400 });
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Create User & DatingProfile with PENDING_REVIEW status
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        username,
        role: "WOMAN",
        gender: "WOMAN",
        birthDate: dob,
        verificationStatus: "PENDING",
        isActive: true,
        datingProfile: {
          create: {
            bio: bio || null,
            tagline: tagline || null,
            city: city || "Lagos",
            country: country || "Nigeria",
            location: city ? `${city}, ${country || "Nigeria"}` : "Lagos, Nigeria",
            dateTypes: Array.isArray(dateTypes) ? dateTypes : [],
            isPublic: true,
            isDiscoverable: true,
          },
        },
        settings: {
          create: {},
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Your profile is pending review.",
      userId: user.id,
    });
  } catch (error) {
    console.error("Member join API error:", error);
    return NextResponse.json({ error: "An error occurred during registration. Please try again." }, { status: 500 });
  }
}
