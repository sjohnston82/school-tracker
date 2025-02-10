import React from "react";
import Image from "next/image";
import ElizabethPic from "../../public/images/elizabeth-trasnsparent-rounded.png";

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center  py-[10vh]">
      <h1 className="font-extrabold text-3xl -mb-12">This page is for my beautiful wife.</h1>
      <Image
        src={ElizabethPic}
        width={700}
        height={700}
        alt="My beautiful wife"
      />
      <h1 className="font-extrabold text-3xl -mt-16">
        This application is to aide her in her journey to become the
        world&apos;s greatest RN.
      </h1>
    </div>
  );
};

export default LandingPage;
