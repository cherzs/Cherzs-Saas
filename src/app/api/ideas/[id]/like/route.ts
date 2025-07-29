import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/ideas/[id]/like - Like/unlike an idea
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user already liked this idea
    const existingLike = await prisma.favorite.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId: id,
        },
      },
    });

    if (existingLike) {
      // Unlike the idea
      await prisma.favorite.delete({
        where: {
          userId_ideaId: {
            userId: session.user.id,
            ideaId: id,
          },
        },
      });

      // Decrease like count
      await prisma.idea.update({
        where: { id: id },
        data: { likes: { decrement: 1 } },
      });

      return NextResponse.json({ liked: false });
    } else {
      // Like the idea
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          ideaId: id,
        },
      });

      // Increase like count
      await prisma.idea.update({
        where: { id: id },
        data: { likes: { increment: 1 } },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error liking idea:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 