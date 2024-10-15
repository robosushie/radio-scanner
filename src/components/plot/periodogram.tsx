"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically load Plotly without SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export const Periodogram: React.FC<{ data: any }> = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure component is mounted before rendering Plotly
  }, []);

  if (!mounted) {
    return null; // Return nothing during SSR
  }

  return (
    <Plot
      className="w-full"
      data={[
        {
          x: data.freqs,
          y: data.psd,
          type: "scatter",
          mode: "lines",
        },
      ]}
      layout={{
        title: "Periodogram",
        xaxis: { title: "" },
        yaxis: { title: "", range: [-70, -5] },
        margin: { t: 40, b: 25, l: 25, r: 25 },
      }}
      config={{
        staticPlot: true, // Disable chart selection and interaction
      }}
    />
  );
};
