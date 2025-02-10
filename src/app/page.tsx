"use client";

import LandingPage from "../components/LandingPage";
// import { getUserSession } from "@/lib/session";
import { useSession } from "next-auth/react";
import ContentWrapper from "@/components/ContentWrapper";

export default function Home() {
  // const user = await getUserSession();
  const { data: sessionData } = useSession();

  return (
    <div className="">
      {!sessionData ? <LandingPage /> : <ContentWrapper />}
    </div>
  );
}
