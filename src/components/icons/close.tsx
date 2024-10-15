import React from "react";
const Close: React.FC<{}> = () => {
  return (
    <div className="relative h-full aspect-square flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        className="w-full h-full"
        fill="#5f6368"
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    </div>
  );
};

export default Close;
