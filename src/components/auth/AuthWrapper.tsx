import { signOut, useSession } from "next-auth/react";
import React from "react";
// import { useAuthStore } from "@/stores/authStore";
import SignInButton from "./SignInButton";

const AuthWrapper = () => {
  const { data: sessionData } = useSession();
  // const { user } = useAuthStore();

  return (
    <div className="">
      {sessionData ? (
        <div className="flex flex-col">
          {/* <p className="text-3xl">Hello, {user?.name}</p> */}
          <li
            className="cursor-pointer list-none text-2xl font-semibold px-4  hover:scale-105 hover:font-extrabold hover:duration-200"
            onClick={() => signOut()}
          >
            Log Out
          </li>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full mr-6">
          <SignInButton />
        </div>
      )}
      {/* <h1 className="">{user?.name}</h1> */}
    </div>
  );
};

export default AuthWrapper;
