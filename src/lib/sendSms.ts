import nodemailer from "nodemailer";

// Carrier Email-to-SMS Domains
const CARRIER_DOMAINS: Record<string, string> = {
  "AT&T": "txt.att.net",
  Verizon: "vtext.com",
  "T-Mobile": "tmomail.net",
  Sprint: "messaging.sprintpcs.com",
  "Boost Mobile": "sms.myboostmobile.com",
  "Cricket Wireless": "sms.cricketwireless.net",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

export const sendSmsViaEmail = async (
  phoneNumber: string,
  carrier: string,
  message: string
) => {
  try {
    const domain = CARRIER_DOMAINS[carrier];
    if (!domain) {
      throw new Error("Carrier not supported");
    }

    const smsEmail = `${phoneNumber}@${domain}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: smsEmail,
      subject: "", // Subject is ignored in SMS
      text: message,
    });

    console.log(`✅ SMS sent to ${phoneNumber} (${carrier})`);
  } catch (error) {
    console.error("❌ Error sending SMS via email:", error);
  }
};
