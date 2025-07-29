import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        website: true,
        location: true,
        bio: true,
        linkedin: true,
        twitter: true,
        github: true,
        userType: true,
        isPublic: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      website,
      location,
      bio,
      linkedin,
      twitter,
      github,
      isPublic,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Update profile
    const updatedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        phone: phone || null,
        website: website || null,
        location: location || null,
        bio: bio || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        github: github || null,
        isPublic: isPublic ?? true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        website: true,
        location: true,
        bio: true,
        linkedin: true,
        twitter: true,
        github: true,
        userType: true,
        isPublic: true,
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 