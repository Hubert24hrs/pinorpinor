import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

// GET /api/conversations/[id]/messages — paginated message history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const { id: conversationId } = await params;

  // Verify membership
  const member = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "30"));

  const messages = await prisma.message.findMany({
    where: { conversationId, isDeleted: false },
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      mediaUrl: true,
      status: true,
      createdAt: true,
      senderId: true,
      sender: { select: { displayName: true, username: true } },
    },
  });

  // Mark messages as read
  await prisma.conversationMember.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });

  const nextCursor = messages.length === limit ? messages[messages.length - 1].id : null;

  return NextResponse.json({ messages: messages.reverse(), nextCursor });
}

// POST /api/conversations/[id]/messages — send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id;
  const { id: conversationId } = await params;

  // Verify membership and conversation is not from an unmatched pair
  const [member, match] = await Promise.all([
    prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    }),
    prisma.match.findUnique({
      where: { conversationId },
      select: { unmatchedAt: true },
    }),
  ]);

  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (match?.unmatchedAt) {
    return NextResponse.json({ error: "This match has been ended" }, { status: 403 });
  }

  const { content, mediaUrl } = await req.json();

  if (!content && !mediaUrl) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }
  if (content && content.length > 1000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { conversationId, senderId: userId, content, mediaUrl },
    select: {
      id: true,
      content: true,
      mediaUrl: true,
      status: true,
      createdAt: true,
      senderId: true,
    },
  });

  // Bump conversation updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Notify the other user
  const otherMember = await prisma.conversationMember.findFirst({
    where: { conversationId, userId: { not: userId } },
  });
  if (otherMember) {
    await prisma.notification.create({
      data: {
        userId: otherMember.userId,
        type: "MESSAGE",
        title: "New Message",
        body: content ? content.slice(0, 80) : "Sent you a photo",
        data: { conversationId, fromUserId: userId },
      },
    });
  }

  return NextResponse.json({ message }, { status: 201 });
}
