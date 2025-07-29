import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/ideas/[id] - Get individual idea details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idea = await prisma.idea.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            userType: true,
          },
        },
      },
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.idea.update({
      where: { id: id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ idea });
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/ideas/[id] - Update an idea
export async function PUT(
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

    const body = await request.json();
    const { title, description, screenshots } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Check if user owns this idea
    const existingIdea = await prisma.idea.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingIdea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    if (existingIdea.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own ideas" },
        { status: 403 }
      );
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        title,
        description,
        screenshots: screenshots || [],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            userType: true,
          },
        },
      },
    });

    return NextResponse.json(updatedIdea);
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/ideas/[id] - Delete an idea
export async function DELETE(
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

    // Check if user owns this idea
    const existingIdea = await prisma.idea.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingIdea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    if (existingIdea.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own ideas" },
        { status: 403 }
      );
    }

    await prisma.idea.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Idea deleted successfully" });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 