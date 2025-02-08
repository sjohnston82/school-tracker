import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classId = params.id; // Get the assignment ID from the route parameters

    if (!classId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    // Find the assignment to ensure it exists and belongs to the authenticated user
    const classToDelete = await prisma.class.findUnique({
      where: { id: classId },
      include: { user: true }, // Include the user to check ownership
    });

    if (!classToDelete) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Check if the class belongs to the authenticated user
    if (classToDelete.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized to delete this class" },
        { status: 403 }
      );
    }

    // Delete the class
    await prisma.class.delete({
      where: { id: classId },
    });

    return NextResponse.json(
      { message: "Class deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error deleting class:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
