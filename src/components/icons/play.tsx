import React from "react";
const Play: React.FC<{}> = () => {
  return (
    <div className="relative h-full aspect-square flex justify-center items-center">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        fill="#00AA00"
      >
        <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
      </svg>
    </div>
  );
};

export default Play;
