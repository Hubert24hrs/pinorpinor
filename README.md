# Pinorpinor — Dating & Date-Night Platform

Pinorpinor is a modern dating and date-night meetup platform built with **Next.js 16**, **NextAuth v4/v5**, **Prisma**, and **PostgreSQL**. Users create profiles, discover matches via swipe decks, exchange private messages, and propose real dates.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database
- (Optional) Redis for rate-limiting

### 2. Environment Setup
Copy `.env.example` to `.env.local` and set your credentials:
```bash
cp .env.example .env.local
```

### 3. Database Migration & Seed
```bash
# Generate Prisma Client
npx prisma generate

# Apply Migrations
npx prisma migrate dev

# Seed test data (admin, sample profiles, matches)
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🌟 Key Features
- **Age-Gated Signup (18+)**: Server-side and client-side age verification on birth dates.
- **Swipe Discovery Deck**: Filtered candidate deck excluding swiped/blocked users.
- **Automatic Matching**: Mutual likes trigger a Match and open a Conversation.
- **In-Chat Date Proposals**: Propose venue, date & time, accept/decline/reschedule with date safety checklist.
- **One-Tap Safety**: Instant user block & report mechanics.
- **Natural Design System**: Warm, trustworthy editorial design system.
