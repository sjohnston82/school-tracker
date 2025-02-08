import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the class ID from the URL parameters
    const classId = req.nextUrl.pathname.split("/")[3]; // Accessing the dynamic [id] segment

    if (!classId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    // Find the class to ensure it exists and belongs to the authenticated user
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

    // Start a transaction to delete assignments and the class
    await prisma.$transaction(async (prisma) => {
      // Delete all assignments associated with this class
      await prisma.assignment.deleteMany({
        where: { classId: classToDelete.id },
      });

      // Now delete the class
      await prisma.class.delete({
        where: { id: classId },
      });
    });

    return NextResponse.json(
      { message: "Class and associated assignments deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error deleting class and assignments:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
