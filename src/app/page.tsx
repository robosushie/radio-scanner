"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/components/icons/logo";
import { MapPlotter } from "@/components/map";
import { Periodogram } from "@/components/plot/periodogram";
import { Spectrogram } from "@/components/plot/spectrogram";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  const [periodogramData, setPeriodogramData] = useState({
    freqs: [],
    psd: [],
  });
  const [spectrogramData, setSpectrogramData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    // if (typeof window !== "undefined") {
    const ws = new WebSocket("wss://refined-magnetic-buck.ngrok.io/ws/stream");

    ws.onopen = () => {
      setConnectionStatus("Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);
      if (data.periodogram) {
        setPeriodogramData(data.periodogram);
      }
      if (data.spectrogram) {
        setSpectrogramData(data.spectrogram);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("Disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setConnectionStatus("Error");
    };

    return () => {
      ws.close();
    };
    // }
  }, []);
  return (
    <section className="min-w-screen min-h-dvh flex flex-col gap-1 bg-slate-200">
      <section className="w-full h-10 flex justify-between bg-white">
        <div className="h-full flex gap-2 justify-between items-center p-1.5">
          <Logo />
          RadioScan
        </div>
      </section>
      {/* <section className=" w-full grow"> */}
      <section className="w-full h-1/2 bg-white">
        <Periodogram data={periodogramData} />
      </section>
      <section className="w-full h-1/2 bg-white">
        <Spectrogram data={spectrogramData} />
      </section>
      {/* </section> */}
      <Sidebar />
      <MapPlotter />
    </section>
  );
}
