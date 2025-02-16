import React from "react";
import ClassesContainer from "./classes/ClassesContainer";
import Calendar from "./Caldendar";

const ContentWrapper = () => {
  return (
    <div className="flex px-8 gap-8 h-[calc(100vh-4rem)] overflow-hidden pt-12 pr-12">
      <ClassesContainer />
      <Calendar />
    </div>
  );
};

export default ContentWrapper;
