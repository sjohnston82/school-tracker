import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import Header from "@/components/nav/Header";
import AuthProvider from "@/stores/AuthProvider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elizabeth's School Tracker",
  description: "An application to help my wife keep tracker of her school assignments.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${roboto.className}  antialiased bg-lighterpurp`}
      >
        <AuthProvider session={session}>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
