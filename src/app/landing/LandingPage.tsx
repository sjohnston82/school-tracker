import React from "react";
import Image from "next/image";
import ElizabethPic from "../../../public/images/elizabeth-trasnsparent-rounded.png";

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center  mt-20">
      <h1 className="font-extrabold text-3xl">This page is for my beautiful wife.</h1>
      <Image
        src={ElizabethPic}
        width={800}
        height={600}
        alt="My beautiful wife"
      />
      <h1 className="font-extrabold text-3xl">
        This application is to aide her in her journey to become the
        world&apos;s greatest RN.
      </h1>
    </div>
  );
};

export default LandingPage;
