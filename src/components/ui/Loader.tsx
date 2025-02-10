import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center mt-32 ">
      <div className="w-32 h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
