import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface AssignmentRequestBody {
  title: string;
  classId: string; 
  description?: string;
  dueDate: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, classId, description, dueDate } =
      (await req.json()) as AssignmentRequestBody;
    if (!title || !classId || !dueDate) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        class: {
          connect: { id: classId }, // Connect to the Class using classId
        },
        description,
        user: {
          connect: { id: user.id }, // Connect to the User
        },
      },
    });

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error(
      "Error creating assignment:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { assignments: true }, // Fetch related classes
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.assignments, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}