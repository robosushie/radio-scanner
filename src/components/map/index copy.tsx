"use client";
import React, { useEffect, useState, useRef } from "react";
import Close from "../icons/close";
import { Undo2 } from "lucide-react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";

interface Position {
  lat: number;
  lng: number;
}

interface Line {
  start: Position;
  end: Position;
}

// Custom Arrow Marker Component
const ArrowMarker = ({
  position,
  heading,
}: {
  position: Position;
  heading: number;
}) => {
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.style.transform = `rotate(${heading}deg)`;
    }
  }, [heading]);

  return (
    <AdvancedMarker position={position}>
      <div className="relative w-6 h-6">
        <svg
          className="absolute top-[12px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#dc2626"
        >
          <g transform={`rotate(${heading} 480 -480)`}>
            <path
              d="M480-214 202-88q-14.75 7-28.89 3.08-14.14-3.93-23.11-11.97-7.15-8.88-10.58-22.71Q136-133.43 142-147l297-677q4.97-13 16.71-20 11.73-7 24.27-7 12.53 0 24.29 7 11.75 7 17.73 20l297 677q5 13.57 1.58 27.4-3.43 13.83-10.58 22.71-8.97 8.04-23.11 11.97Q772.75-81 758-88L480-214Z"
              fill="#dc2626"
            />
          </g>
        </svg>
      </div>
    </AdvancedMarker>
  );
};

// Line Layer Component
const LineLayer = ({ lines }: { lines: Line[] }) => {
  const map = useMap();
  const polylineRefs = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing polylines
    polylineRefs.current.forEach((line) => line.setMap(null));
    polylineRefs.current = [];

    // Create new polylines
    lines.forEach((line) => {
      const polyline = new google.maps.Polyline({
        path: [line.start, line.end],
        geodesic: true,
        strokeColor: "#2563eb",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
      });
      polylineRefs.current.push(polyline);
    });

    return () => {
      polylineRefs.current.forEach((line) => line.setMap(null));
    };
  }, [map, lines]);

  return null;
};

export const MapPlotter = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [expandMap, setExpandMap] = useState(false);
  const [zoom, setZoom] = useState(16);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [position, setPosition] = useState<Position>({
    lat: 28.6139,
    lng: 77.2088,
  });
  const [heading, setHeading] = useState<number>(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to calculate end point given start point, bearing and distance
  const calculateEndPoint = (
    start: Position,
    bearing: number,
    distance: number
  ): Position => {
    const R = 6371; // Earth's radius in km
    const d = distance / R; // Angular distance
    const lat1 = (start.lat * Math.PI) / 180;
    const lng1 = (start.lng * Math.PI) / 180;
    const bearing_rad = (bearing * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d) +
        Math.cos(lat1) * Math.sin(d) * Math.cos(bearing_rad)
    );

    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearing_rad) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
      );

    return {
      lat: (lat2 * 180) / Math.PI,
      lng: (lng2 * 180) / Math.PI,
    };
  };

  // Function to draw line
  const drawLine = () => {
    const endPoint = calculateEndPoint(position, heading, 10); // 10km line
    setLines([...lines, { start: position, end: endPoint }]);
  };

  useEffect(() => {
    let isMounted = true;
    let watchId: number;

    // Function to handle device orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (isMounted) {
        // Check for iOS compass
        if ("webkitCompassHeading" in event) {
          setHeading((event as any).webkitCompassHeading);
        } else if (event.alpha !== null) {
          // Android: Convert alpha to clockwise heading
          setHeading(360 - event.alpha + 180);
        }
      }
    };

    // Function to get position and watch for changes
    const setupGeolocation = () => {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            if (isMounted) {
              setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              setError(null);
            }
          },
          (err) => {
            console.error("Geolocation error:", err);
            if (isMounted) {
              setError(err.message);
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          }
        );
      }
    };

    // Setup orientation watching
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      // Request permission for iOS devices
      const requestPermission = async () => {
        if (
          typeof (DeviceOrientationEvent as any).requestPermission ===
          "function"
        ) {
          try {
            const permission = await (
              DeviceOrientationEvent as any
            ).requestPermission();
            if (permission === "granted") {
              window.addEventListener(
                "deviceorientation",
                handleOrientation,
                true
              );
            }
          } catch (error) {
            console.error(
              "Error requesting device orientation permission:",
              error
            );
          }
        } else {
          // For non-iOS devices, add the listener directly
          window.addEventListener("deviceorientation", handleOrientation, true);
        }
      };

      requestPermission();
    }

    // Setup geolocation watching
    setupGeolocation();

    return () => {
      isMounted = false;
      if (watchId) navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const renderMap = () => {
    if (isLoading || !position) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Loading...
        </div>
      );
    }
    return (
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={position}
          defaultZoom={zoom}
          mapId="DEMO_MAP_ID"
          fullscreenControl={false}
          mapTypeControl={false}
          zoomControl={false}
          streetViewControl={false}
        >
          <ArrowMarker position={position} heading={heading} />
          <LineLayer lines={lines} />
        </Map>
      </APIProvider>
    );
  };

  return (
    <>
      {expandMap ? (
        <div className="fixed z-50 w-full h-full top-0 left-0 bg-slate-500 flex justify-center items-center bg-opacity-50 backdrop-blur-sm">
          <div
            className="absolute w-7 h-7 top-4 right-4 bg-white rounded-md p-1 shadow-md border-2 cursor-pointer"
            onClick={() => {
              document.body.style.overflow = "auto";
              setExpandMap(false);
            }}
          >
            <Close />
          </div>
          <div className="w-5/6 h-5/6 bg-white rounded-xl p-1 shadow-md border-2 relative">
            {renderMap()}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
                onClick={drawLine}
                disabled={isLoading}
              >
                Draw 10km Line
              </button>
              <div className="bg-white p-2 rounded-md shadow-md">
                <Undo2
                  className={`w-6 h-6 ${
                    lines.length === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 cursor-pointer hover:text-gray-900"
                  }`}
                  onClick={() => {
                    if (lines.length > 0) {
                      setLines(lines.slice(0, -1));
                    }
                  }} // Remove last line
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="fixed w-28 h-28 bg-white rounded-xl bottom-4 left-4 p-1 shadow-md border-2 cursor-pointer"
          onClick={() => {
            document.body.style.overflow = "hidden";
            setExpandMap(true);
          }}
        >
          {renderMap()}
        </div>
      )}
    </>
  );
};
