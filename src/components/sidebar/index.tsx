"use client";
import React, { useState } from "react";
import ChevronLeft from "@/components/icons/chevron-left";
import Play from "@/components/icons/play";
import Close from "../icons/close";
import Pause from "../icons/pause";

export const Sidebar = () => {
  const [expandSidebar, setExpandSidebar] = useState(false);

  return (
    <>
      {expandSidebar ? (
        <div className="fixed z-50 w-full h-full top-0 left-0 bg-slate-500 flex justify-center items-center bg-opacity-50 backdrop-blur-sm">
          <div
            className="absolute w-7 h-7 top-4 right-4 bg-white rounded-md p-1 shadow-md border-2"
            onClick={() => {
              document.body.style.overflow = "auto";
              setExpandSidebar(false);
            }}
          >
            <Close />
          </div>
          <div className="w-5/6 h-5/6 bg-white rounded-xl p-1 shadow-md border-2"></div>
        </div>
      ) : (
        <div className="fixed top-4 right-4 flex flex-col gap-2">
          <div
            className="w-10 h-10 bg-white rounded-lg p-2 shadow-md border-2"
            onClick={() => {
              document.body.style.overflow = "hidden";
              setExpandSidebar(true);
            }}
          >
            <ChevronLeft />
          </div>
          <div
            className="w-10 h-10 bg-white rounded-lg p-2 shadow-md border-2 border-green-500"
            onClick={() => {}}
          >
            <Play />
          </div>
          <div
            className="w-10 h-10 bg-white rounded-lg p-2 shadow-md border-2 border-red-500"
            onClick={() => {}}
          >
            <Pause />
          </div>
        </div>
      )}
    </>
  );
};
