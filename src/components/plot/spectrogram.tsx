"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically load Plotly without SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export const Spectrogram: React.FC<{ data: any }> = ({ data }) => {
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
          z: data,
          type: "heatmap",
          colorscale: "Viridis",
          colorbar: { orientation: "h" },
        },
      ]}
      layout={{
        title: "Spectrogram",
        xaxis: { title: "" },
        yaxis: { title: "" },
        margin: { t: 40, b: 25, l: 35, r: 25 },
      }}
      config={{
        staticPlot: true, // Disable chart selection and interaction
      }}
    />
  );
};
