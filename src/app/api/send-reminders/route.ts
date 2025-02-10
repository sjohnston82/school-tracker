import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function GET() {
  const phoneEmail = `${process.env.ELIZABETH_PHONE}@txt.att.net`; // AT&T SMS gateway
  const hoursBeforeDue = 24;

  const now = new Date();
  const dueThreshold = new Date(
    now.getTime() + hoursBeforeDue * 60 * 60 * 1000
  );

  const assignments = await prisma.assignment.findMany({
    where: {
      dueDate: {
        lte: dueThreshold,
        gte: now,
      },
    },
    include: { class: true },
  });

  if (assignments.length === 0) {
    return NextResponse.json({ message: "No assignments due soon." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "elizabethsschooltracker@gmail.com",
      pass: "oizr zluw zudy rmlo",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Concise Message
  let message = `Upcoming Assignments:\n`;
  assignments.forEach((assignment) => {
    message += `${assignment.title} (${
      assignment.class?.name
    }) - Due: ${new Date(assignment.dueDate).toLocaleDateString()}\n`;
  });

  // // Keep message within 160 characters if possible
  // message = message.trim().substring(0, 160);

  await transporter.sendMail({
    from: "elizabethsschooltracker@gmail.com", // Try leaving empty or using a no-reply email
    to: phoneEmail,
    subject: "", // No subject to avoid "SUBJ" field in SMS
    text: message,
  });

  return NextResponse.json({ message: "Reminders sent successfully." });
}
