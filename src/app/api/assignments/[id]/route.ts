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

    const assignmentId = params.id; // Get the assignment ID from the route parameters

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    // Find the assignment to ensure it exists and belongs to the authenticated user
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { user: true }, // Include the user to check ownership
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Check if the assignment belongs to the authenticated user
    if (assignment.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized to delete this assignment" },
        { status: 403 }
      );
    }

    // Delete the assignment
    await prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return NextResponse.json(
      { message: "Assignment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error deleting assignment:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
