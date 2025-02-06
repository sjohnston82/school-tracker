import React from "react";
import Image from "next/image";
import ElizabethPic from "../../../public/images/elizabeth2.webp";

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-20 mt-20">
      <h1 className="font-extrabold text-2xl">This page is for my beautiful wife.</h1>
      <Image
        src={ElizabethPic}
        width={400}
        height={400}
        alt="My beautiful wife"
      />
      <h1 className="font-extrabold text-2xl">
        This application is to aide her in her journey to become the
        world&apos;s greatest RN.
      </h1>
    </div>
  );
};

export default LandingPage;
