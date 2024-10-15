import React from "react";
const Pause: React.FC<{}> = () => {
  return (
    <div className="relative h-full aspect-square flex justify-center items-center">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        fill="#AA0000"
      >
        <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
      </svg>
    </div>
  );
};

export default Pause;
