"use client";
import React, { useEffect, useState } from "react";
import Close from "../icons/close";

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

export const MapPlotter: React.FC<{}> = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [expandMap, setExpandMap] = useState(false);
  const [zoom, setZoom] = useState(16);
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2088 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // To prevent state updates if the component is unmounted
    let intervalId: number;

    // Function to fetch the current position
    const fetchPosition = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (isMounted) {
              setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              setError(null); // Clear previous errors
            }
          },
          (err) => {
            console.error("Geolocation error:", err);
            if (isMounted) {
              switch (err.code) {
                case err.PERMISSION_DENIED:
                  setError("User denied the request for Geolocation.");
                  break;
                case err.POSITION_UNAVAILABLE:
                  setError("Location information is unavailable.");
                  break;
                case err.TIMEOUT:
                  setError("The request to get user location timed out.");
                  break;
                default:
                  setError("An unknown error occurred.");
                  break;
              }
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000, // 10 seconds
          }
        );
      } else {
        if (isMounted) {
          setError("Geolocation is not supported by your browser.");
        }
      }
    };

    // Initial fetch
    fetchPosition();

    // Set up the interval to fetch position every 30 seconds (30000 milliseconds)
    intervalId = window.setInterval(fetchPosition, 30000);

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);
  return (
    <>
      {expandMap ? (
        <div className="fixed z-50 w-full h-full top-0 left-0 bg-slate-500 flex justify-center items-center bg-opacity-50 backdrop-blur-sm">
          <div
            className="absolute w-7 h-7 top-4 right-4 bg-white rounded-md p-1 shadow-md border-2"
            onClick={() => {
              document.body.style.overflow = "auto";
              setExpandMap(false);
            }}
          >
            <Close />
          </div>
          <div className="w-5/6 h-5/6 bg-white rounded-xl p-1 shadow-md border-2">
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={position}
                defaultZoom={zoom}
                mapId="DEMO_MAP_ID"
                fullscreenControl={false}
                mapTypeControl={false}
              >
                <AdvancedMarker position={position} />
              </Map>
            </APIProvider>
          </div>
        </div>
      ) : (
        <div
          className="fixed w-28 h-28 bg-white rounded-xl bottom-4 left-4 p-1 shadow-md border-2"
          onClick={() => {
            document.body.style.overflow = "hidden";
            setExpandMap(true);
          }}
        >
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={position}
              defaultZoom={zoom}
              mapId="DEMO_MAP_ID"
              fullscreenControl={false}
              mapTypeControl={false}
            >
              <AdvancedMarker position={position} />
            </Map>
          </APIProvider>
        </div>
      )}
    </>
  );
};
