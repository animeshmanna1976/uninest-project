"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Home, IndianRupee, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const highlightedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Property {
  id: string;
  title: string;
  slug: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  rent: number;
  propertyType: string;
  genderPreference: string;
  averageRating: number;
  images: { url: string; isPrimary: boolean; caption: string }[];
}

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onPropertySelect?: (propertyId: string) => void;
  className?: string;
}

// Component to update map view when properties change
function MapUpdater({
  properties,
  selectedPropertyId,
}: {
  properties: Property[];
  selectedPropertyId?: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;

    // If a property is selected, center on it
    if (selectedPropertyId) {
      const selected = properties.find((p) => p.id === selectedPropertyId);
      if (selected) {
        map.setView([selected.latitude, selected.longitude], 15);
        return;
      }
    }

    // Otherwise fit bounds to show all properties
    if (properties.length === 1) {
      map.setView([properties[0].latitude, properties[0].longitude], 14);
    } else {
      const bounds = L.latLngBounds(
        properties.map((p) => [p.latitude, p.longitude] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, properties, selectedPropertyId]);

  return null;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  onPropertySelect,
  className = "",
}: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on server side
  if (!isMounted) {
    return (
      <div
        className={`bg-muted rounded-xl flex items-center justify-center ${className}`}
      >
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Default center (Kolkata)
  const defaultCenter: [number, number] = [22.5726, 88.3639];
  const center: [number, number] =
    properties.length > 0
      ? [properties[0].latitude, properties[0].longitude]
      : defaultCenter;

  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater
          properties={properties}
          selectedPropertyId={selectedPropertyId}
        />

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={
              selectedPropertyId === property.id ? highlightedIcon : customIcon
            }
            eventHandlers={{
              click: () => onPropertySelect?.(property.id),
            }}
          >
            <Popup>
              <div className="w-64 p-1">
                <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
                  <img
                    src={property.images[0]?.url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-primary">
                    {property.propertyType}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                  {property.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {property.address}, {property.city}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <IndianRupee className="h-3 w-3" />
                    <span>{property.rent.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      /mo
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {property.genderPreference === "MALE"
                      ? "Boys"
                      : property.genderPreference === "FEMALE"
                        ? "Girls"
                        : "Any"}
                  </Badge>
                </div>
                <Link href={`/properties/${property.slug}`}>
                  <Button size="sm" className="w-full text-xs">
                    View Details
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
