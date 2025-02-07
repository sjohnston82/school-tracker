"use client"

import Calendar from "@/components/Caldendar";
import LandingPage from "./landing/LandingPage";
// import { getUserSession } from "@/lib/session";
import { useSession } from "next-auth/react";

export default function Home() {
  // const user = await getUserSession();
   const { data: sessionData } = useSession();

  return <>{!sessionData ? <LandingPage /> : <Calendar />}</>;
}
