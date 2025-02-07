import { signIn } from "next-auth/react";
import React from "react";

const SignInButton = () => {
  const signInWithClick = async () => {
    await signIn();
  };
  return (
    <button
      className="cursor-pointer  text-2xl font-bold px-4  hover:scale-105 hover:font-extrabold hover:duration-200"
      onClick={() => signInWithClick()}
    >
      Sign In
    </button>
  );
};

export default SignInButton;
