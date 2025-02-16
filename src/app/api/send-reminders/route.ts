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

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// interface TextBeltResponse {
//   success: boolean;
//   quotaRemaining?: number;
//   error?: string;
// }

// export async function POST() {
//   try {
//     const phoneNumber = process.env.ELIZABETH_PHONE;
//     if (!phoneNumber) {
//       throw new Error("Missing phone number in environment variables.");
//     }

//     const hoursBeforeDue = 24;
//     const now = new Date();
//     const dueThreshold = new Date(
//       now.getTime() + hoursBeforeDue * 60 * 60 * 1000
//     );

//     const assignments = await prisma.assignment.findMany({
//       where: {
//         dueDate: { lte: dueThreshold, gte: now },
//       },
//       include: { class: true },
//     });

//     if (assignments.length === 0) {
//       return NextResponse.json({ message: "No assignments due soon." });
//     }

//     let message = `Upcoming Assignments:\n`;
//     assignments.forEach((assignment) => {
//       message += `${assignment.title} (${
//         assignment.class?.name
//       }) - Due: ${new Date(assignment.dueDate).toLocaleDateString()}\n`;
//     });

//     // // Trim the message to fit SMS limits
//     // message = message.trim().substring(0, 160);

//     const response = await fetch("https://textbelt.com/text", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         phone: phoneNumber,
//         message,
//         key: "textbelt", // Free tier key (1 SMS per day)
//       }),
//     });

//     const data: TextBeltResponse = await response.json();

//     if (!data.success) {
//       throw new Error(`TextBelt error: ${data.error || "Unknown error"}`);
//     }

//     return NextResponse.json({
//       message: "Reminder sent successfully.",
//       quotaRemaining: data.quotaRemaining ?? "N/A",
//     });
//   } catch (error) {
//     console.error("SMS error:", error);
//     return NextResponse.json(
//       { error: (error as Error).message || "Failed to send SMS" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { Twilio } from "twilio";
// import { prisma } from "@/lib/prisma"; // Assuming you have Prisma set up

// export async function GET() {
//   try {
//     // Load environment variables
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
//     const recipientPhone = process.env.ELIZABETH_PHONE;

//     if (!accountSid || !authToken || !twilioPhone || !recipientPhone) {
//       throw new Error("Missing Twilio environment variables");
//     }

//     // Initialize Twilio client
//     const client = new Twilio(accountSid, authToken);

//     // Find assignments due in the next 24 hours
//     const hoursBeforeDue = 24;
//     const now = new Date();
//     const dueThreshold = new Date(
//       now.getTime() + hoursBeforeDue * 60 * 60 * 1000
//     );

//     const assignments = await prisma.assignment.findMany({
//       where: {
//         dueDate: { lte: dueThreshold, gte: now },
//       },
//       include: { class: true },
//     });

//     if (assignments.length === 0) {
//       return NextResponse.json({ message: "No assignments due soon." });
//     }

//     // Format message
//     let message = `Upcoming Assignments:\n`;
//     assignments.forEach((assignment) => {
//       message += `${assignment.title} (${
//         assignment.class?.name
//       }) - Due: ${new Date(assignment.dueDate).toLocaleDateString()}\n`;
//     });

//     // Send SMS
//     const smsResponse = await client.messages.create({
//       body: message,
//       from: twilioPhone,
//       to: recipientPhone,
//     });

//     return NextResponse.json({
//       message: "Reminder sent successfully.",
//       sid: smsResponse.sid,
//     });
//   } catch (error) {
//     console.error("Twilio SMS error:", error);
//     return NextResponse.json(
//       { error: (error as Error).message || "Failed to send SMS" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import twilio from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// if (!accountSid || !authToken || !twilioPhone) {
//   throw new Error("Twilio environment variables are missing.");
// }

// const client = twilio(accountSid, authToken);

// export async function GET() {
//   try {
//     const recipientPhone = process.env.ELIZABETH_PHONE;
//     if (!recipientPhone) {
//       throw new Error(
//         "Recipient phone number is missing in environment variables."
//       );
//     }

//     const message = await client.messages.create({
//       body: "Test message from Twilio!",
//       from: twilioPhone,
//       to: recipientPhone,
//     });

//     return NextResponse.json({ success: true, messageSid: message.sid });
//   } catch (error) {
//     console.error("Twilio SMS error:", error);
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
