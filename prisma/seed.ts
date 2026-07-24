import { PrismaClient, UserRole, PostStatus } from "@prisma/client";
import { hash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  // Simple SHA256 for seed data — in production NextAuth handles hashing
  return hash("sha256", password).toString("hex");
}

async function main() {
  console.log("🌱 Seeding Pinorpinor database...");

  // ── Categories ──────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "photography" },
      update: {},
      create: { name: "Photography", slug: "photography", description: "Visual storytellers", color: "#FF2E88", order: 1, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "video" },
      update: {},
      create: { name: "Video & Film", slug: "video", description: "Filmmakers and videographers", color: "#7C3AED", order: 2, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "art" },
      update: {},
      create: { name: "Digital Art", slug: "art", description: "Digital artists and illustrators", color: "#00E5FF", order: 3, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "music" },
      update: {},
      create: { name: "Music", slug: "music", description: "Musicians and producers", color: "#FFD700", order: 4, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: { name: "Fashion", slug: "fashion", description: "Style icons and designers", color: "#FF6B6B", order: 5, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "travel" },
      update: {},
      create: { name: "Travel", slug: "travel", description: "Wanderers and explorers", color: "#00D26A", order: 6, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "fitness" },
      update: {},
      create: { name: "Fitness", slug: "fitness", description: "Athletes and trainers", color: "#F59E0B", order: 7, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "food" },
      update: {},
      create: { name: "Food & Cooking", slug: "food", description: "Chefs and food lovers", color: "#EF4444", order: 8, isActive: true },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ── Admin User ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@pinorpinor.com" },
    update: {},
    create: {
      email: "admin@pinorpinor.com",
      name: "Pinorpinor Admin",
      username: "admin",
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      profile: {
        create: {
          bio: "Platform administrator",
          isPublic: true,
        },
      },
      settings: { create: {} },
    },
  });

  // ── Demo Creators ────────────────────────────────────────────
  const creatorData = [
    {
      email: "luna@pinorpinor.com",
      name: "Luna Vasquez",
      username: "lunavasquez",
      bio: "✨ Visual storyteller capturing the beauty of everyday moments. Photography & digital art.",
      tagline: "Light chaser. Dream maker.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop",
      banner: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&h=400&fit=crop",
      category: "photography",
      instagram: "https://instagram.com/lunavasquez",
    },
    {
      email: "kai@pinorpinor.com",
      name: "Kai Okonkwo",
      username: "kaiokonkwo",
      bio: "🎬 Filmmaker | Cinematographer | Dreamer. Turning stories into cinematic experiences.",
      tagline: "Every frame tells a story.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      banner: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1200&h=400&fit=crop",
      category: "video",
      youtube: "https://youtube.com/@kaiokonkwo",
    },
    {
      email: "aria@pinorpinor.com",
      name: "Aria Chen",
      username: "ariachen",
      bio: "🎨 Digital artist & illustrator. Creating worlds with pixels and imagination.",
      tagline: "Art is the soul made visible.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      banner: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&h=400&fit=crop",
      category: "art",
      instagram: "https://instagram.com/ariachen.art",
    },
    {
      email: "marcus@pinorpinor.com",
      name: "Marcus Bell",
      username: "marcusbell",
      bio: "🎵 Music producer & composer. Crafting soundscapes that move the soul.",
      tagline: "Music is the language of emotion.",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
      banner: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=400&fit=crop",
      category: "music",
    },
    {
      email: "sofia@pinorpinor.com",
      name: "Sofia Reyes",
      username: "sofiareyes",
      bio: "👗 Fashion designer & style curator. Celebrating individuality through fashion.",
      tagline: "Style is a way of saying who you are.",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
      banner: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop",
      category: "fashion",
      instagram: "https://instagram.com/sofiareyes.style",
    },
    {
      email: "james@pinorpinor.com",
      name: "James Nakamura",
      username: "jamesnakamura",
      bio: "✈️ Travel photographer & adventure seeker. 50+ countries and counting.",
      tagline: "The world is my canvas.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
      banner: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=400&fit=crop",
      category: "travel",
    },
  ];

  const creators = [];
  for (const data of creatorData) {
    const category = categories.find((c) => c.slug === data.category);
    const creator = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        username: data.username,
        role: UserRole.CREATOR,
        verificationStatus: "VERIFIED",
        emailVerified: new Date(),
        image: data.avatar,
        profile: {
          create: {
            bio: data.bio,
            tagline: data.tagline,
            avatarUrl: data.avatar,
            bannerUrl: data.banner,
            categoryId: category?.id,
            instagramUrl: data.instagram,
            youtubeUrl: data.youtube,
            isPublic: true,
          },
        },
        settings: { create: {} },
      },
    });
    creators.push(creator);
  }

  console.log(`✅ Created ${creators.length} demo creators`);

  // ── Demo Hashtags ────────────────────────────────────────────
  const hashtags = await Promise.all([
    prisma.hashtag.upsert({ where: { name: "photography" }, update: {}, create: { name: "photography", postCount: 0 } }),
    prisma.hashtag.upsert({ where: { name: "art" }, update: {}, create: { name: "art", postCount: 0 } }),
    prisma.hashtag.upsert({ where: { name: "creator" }, update: {}, create: { name: "creator", postCount: 0 } }),
    prisma.hashtag.upsert({ where: { name: "pinorpinor" }, update: {}, create: { name: "pinorpinor", postCount: 0 } }),
    prisma.hashtag.upsert({ where: { name: "travel" }, update: {}, create: { name: "travel", postCount: 0 } }),
    prisma.hashtag.upsert({ where: { name: "fashion" }, update: {}, create: { name: "fashion", postCount: 0 } }),
    prisma.hashtag.upsert({ where: { name: "music" }, update: {}, create: { name: "music", postCount: 0 } }),
    prisma.hashtag.upsert({ where: { name: "film" }, update: {}, create: { name: "film", postCount: 0 } }),
  ]);

  console.log(`✅ Created ${hashtags.length} hashtags`);

  // ── Demo Posts ───────────────────────────────────────────────
  const postImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=800&fit=crop",
  ];

  for (let i = 0; i < creators.length; i++) {
    const creator = creators[i];
    const post = await prisma.post.create({
      data: {
        userId: creator.id,
        caption: `Sharing my latest work with the world ✨ #pinorpinor #creator`,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - i * 86400000),
        photos: {
          create: {
            userId: creator.id,
            cloudinaryId: `demo_photo_${i}`,
            url: postImages[i],
            thumbnailUrl: postImages[i],
            width: 800,
            height: 800,
            format: "jpg",
          },
        },
      },
    });

    // Add hashtags to posts
    await prisma.postHashtag.create({
      data: {
        postId: post.id,
        hashtagId: hashtags[0].id,
      },
    });
  }

  console.log(`✅ Created demo posts`);

  // ── Follow Relationships ─────────────────────────────────────
  for (let i = 0; i < creators.length; i++) {
    for (let j = 0; j < creators.length; j++) {
      if (i !== j && Math.random() > 0.4) {
        await prisma.follow.upsert({
          where: { followerId_followingId: { followerId: creators[i].id, followingId: creators[j].id } },
          update: {},
          create: { followerId: creators[i].id, followingId: creators[j].id },
        });
      }
    }
  }

  console.log(`✅ Created follow relationships`);
  console.log("\n🎉 Seeding complete!");
  console.log("\nDemo accounts (password: pinorpinor123):");
  console.log("  admin@pinorpinor.com — Super Admin");
  creatorData.forEach((c) => console.log(`  ${c.email} — Creator (@${c.username})`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
