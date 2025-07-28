import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: { id: string };
}

// POST /api/ideas/[id]/favorite - Add to favorites
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const ideaId = params.id;

    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId: ideaId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Already favorited" },
        { status: 400 }
      );
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        ideaId: ideaId,
      },
    });

    // Update idea likes count
    await prisma.idea.update({
      where: { id: ideaId },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json(
      { message: "Added to favorites", favorite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/ideas/[id]/favorite - Remove from favorites
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const ideaId = params.id;

    // Check if favorite exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId: ideaId,
        },
      },
    });

    if (!existingFavorite) {
      return NextResponse.json(
        { error: "Not favorited" },
        { status: 400 }
      );
    }

    // Remove favorite
    await prisma.favorite.delete({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId: ideaId,
        },
      },
    });

    // Update idea likes count
    await prisma.idea.update({
      where: { id: ideaId },
      data: { likes: { decrement: 1 } },
    });

    return NextResponse.json(
      { message: "Removed from favorites" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 