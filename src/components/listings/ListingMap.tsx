"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ListingMapProps {
  latitude: number;
  longitude: number;
  businessName: string;
  address: string;
}

export default function ListingMap({
  latitude,
  longitude,
  businessName,
  address,
}: ListingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([latitude, longitude], 15);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background:#2563eb;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="#2563eb"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:system-ui;min-width:150px;">
          <strong style="font-size:14px;">${businessName}</strong>
          <br/><span style="font-size:12px;color:#666;">${address}</span>
          <br/><a href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" target="_blank" rel="noopener" style="font-size:12px;color:#2563eb;text-decoration:none;">Get Directions →</a>
        </div>`
      );

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, businessName, address]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div ref={mapRef} className="h-[300px] w-full" />
      <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">{address}</span>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}
