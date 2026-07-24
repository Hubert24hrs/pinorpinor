import { PrismaClient, UserRole, Gender, RelationshipIntent } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", 12);

  // ── Admin ──────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@pinorpinor.com" },
    update: {},
    create: {
      email: "admin@pinorpinor.com",
      displayName: "Platform Admin",
      username: "admin",
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log("Seeded admin:", admin.email);

  // ── Test Woman ─────────────────────────────────────────────
  const woman = await prisma.user.upsert({
    where: { email: "sofia@test.com" },
    update: {},
    create: {
      email: "sofia@test.com",
      displayName: "Sofia",
      username: "sofia_test",
      passwordHash,
      role: UserRole.WOMAN,
      gender: Gender.WOMAN,
      interestedIn: Gender.MAN,
      birthDate: new Date("1997-03-15"), // 28 years old
      isActive: true,
      datingProfile: {
        create: {
          bio: "Love hiking and good coffee. Looking for genuine connections.",
          tagline: "Adventure & coffee ☕",
          city: "Lagos",
          country: "Nigeria",
          location: "Lekki, Lagos, Nigeria",
          height: "5'6\"",
          relationshipIntent: RelationshipIntent.SERIOUS,
          dateTypes: ["Dinner Dates", "Weekend Getaways", "VIP Events"],
          isPublic: true,
          isDiscoverable: true,
          isAvailableToday: true,
        },
      },
      settings: {
        create: {},
      },
    },
  });
  console.log("Seeded woman:", woman.email);

  // ── Test Man ───────────────────────────────────────────────
  const man = await prisma.user.upsert({
    where: { email: "james@test.com" },
    update: {},
    create: {
      email: "james@test.com",
      displayName: "James",
      username: "james_test",
      passwordHash,
      role: UserRole.MAN,
      gender: Gender.MAN,
      interestedIn: Gender.WOMAN,
      birthDate: new Date("1994-07-22"), // 31 years old
      isActive: true,
      datingProfile: {
        create: {
          bio: "Entrepreneur who loves food, travel, and genuine conversations.",
          tagline: "Building things & exploring places",
          city: "Lagos",
          country: "Nigeria",
          location: "Victoria Island, Lagos, Nigeria",
          height: "6'1\"",
          relationshipIntent: RelationshipIntent.SERIOUS,
          dateTypes: ["Dinner Dates", "VIP Events", "Business Events"],
          isPublic: true,
          isDiscoverable: true,
        },
      },
      settings: {
        create: {},
      },
    },
  });
  console.log("Seeded man:", man.email);

  // ── Second woman for discover testing ──────────────────────
  await prisma.user.upsert({
    where: { email: "amara@test.com" },
    update: {},
    create: {
      email: "amara@test.com",
      displayName: "Amara",
      username: "amara_test",
      passwordHash,
      role: UserRole.WOMAN,
      gender: Gender.WOMAN,
      interestedIn: Gender.MAN,
      birthDate: new Date("1999-11-02"), // 25 years old
      isActive: true,
      datingProfile: {
        create: {
          bio: "Fashion designer by day, foodie by night.",
          tagline: "Style & substance ✨",
          city: "Abuja",
          country: "Nigeria",
          location: "Maitama, Abuja, Nigeria",
          height: "5'4\"",
          relationshipIntent: RelationshipIntent.CASUAL,
          dateTypes: ["Dinner Dates", "Nightlife"],
          isPublic: true,
          isDiscoverable: true,
          isRedHot: true,
        },
      },
      settings: {
        create: {},
      },
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
