import React from "react";
const ChevronLeft: React.FC<{}> = () => {
  return (
    <div className="relative h-full aspect-square flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        className="w-full h-full"
        fill="#5f6368"
      >
        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
      </svg>
    </div>
  );
};

export default ChevronLeft;
