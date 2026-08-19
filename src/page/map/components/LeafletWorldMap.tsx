"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { ImageOverlay, MapContainer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import type { PublicMapLocation } from "./InteractiveMap";
import styles from "@/style/page/map/map.module.css";

const mapBounds = L.latLngBounds([0, 0], [8192, 8192]);
const categoryColors: Record<string, string> = {
  region: "#a9864a",
  boss: "#a64239",
  "landing-area": "#b77924",
  weapon: "#8e64bd",
  sidearm: "#5077a8",
  shell: "#2f86b8",
  "map-station": "#2e7786",
  dungeon: "#6f61a0",
  "evil-statue": "#77716e",
  traversal: "#a86d32",
  merchant: "#5d925c",
  npc: "#6b9083",
};
const categoryLabels: Record<string, string> = {
  region: "Regions & Zones",
  boss: "Bosses",
  "landing-area": "Landing Areas",
  weapon: "Weapons",
  sidearm: "Sidearms",
  shell: "Shells",
  "map-station": "Map Stations",
  dungeon: "Dungeon Entrances",
  "evil-statue": "Evil Statues",
  traversal: "Traversal",
  merchant: "Merchants",
  npc: "NPCs",
};

function markerIcon(location: PublicMapLocation, selected: boolean, found: boolean) {
  const color = categoryColors[location.category] ?? "#c8a35c";
  return L.divIcon({
    className: styles.poiMarker,
    html: `<span class="${styles.poiPin}" style="--poi-color:${color};opacity:${found ? ".48" : "1"};transform:scale(${selected ? "1.35" : "1"})"><i></i></span>`,
    iconSize: [30, 38],
    iconAnchor: [15, 35],
    tooltipAnchor: [0, -31],
  });
}

function MapSynchronizer({ selected, resetToken }: { selected?: PublicMapLocation; resetToken: number }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  useEffect(() => {
    if (resetToken > 0) map.fitBounds(mapBounds, { animate: true });
  }, [map, resetToken]);
  useEffect(() => {
    if (!selected) return;
    const nextZoom = Math.max(map.getZoom(), -.25);
    map.flyTo([8192 - selected.pixel.y, selected.pixel.x], nextZoom, { duration: .55 });
  }, [map, selected]);
  return null;
}

type Props = {
  locations: PublicMapLocation[];
  selected?: PublicMapLocation;
  foundIds: string[];
  highResolution: boolean;
  resetToken: number;
  onSelect: (id: string) => void;
  onClose: () => void;
  onToggleFound: (id: string) => void;
};

export function LeafletWorldMap({ locations, selected, foundIds, highResolution, resetToken, onSelect, onClose, onToggleFound }: Props) {
  const found = useMemo(() => new Set(foundIds), [foundIds]);
  return (
    <MapContainer
      attributionControl={false}
      bounds={mapBounds}
      boxZoom
      className={styles.leafletMap}
      crs={L.CRS.Simple}
      doubleClickZoom
      dragging
      maxBounds={mapBounds.pad(.12)}
      maxBoundsViscosity={.82}
      maxZoom={2}
      minZoom={-3}
      scrollWheelZoom
      touchZoom
      zoomControl
      zoomSnap={.25}
    >
      <ImageOverlay
        bounds={mapBounds}
        opacity={1}
        url={highResolution ? "/assets/map/T_UI_Map_Full_NoFog.png" : "/images/map/open-beta-world-map-preview.webp"}
      />
      {locations.map((location) => (
        <Marker
          eventHandlers={{ click: () => onSelect(location.id) }}
          icon={markerIcon(location, selected?.id === location.id, found.has(location.id))}
          key={location.id}
          position={[8192 - location.pixel.y, location.pixel.x]}
          title={`${location.title}, ${location.category}`}
        >
          <Tooltip direction="top" opacity={.96}>{location.title}</Tooltip>
        </Marker>
      ))}
      {selected ? (
        <Popup
          autoPan
          closeButton
          eventHandlers={{ remove: onClose }}
          keepInView
          maxWidth={360}
          minWidth={280}
          offset={[0, -28]}
          position={[8192 - selected.pixel.y, selected.pixel.x]}
        >
          <article className={styles.mapPopup} aria-label={`${selected.title} location details`}>
            <span>{categoryLabels[selected.category] ?? selected.category}</span>
            <h2>{selected.title}</h2>
            {selected.region ? <p><b>Region</b>{selected.region}</p> : null}
            {selected.location ? <section><h3>Location</h3><p>{selected.location}</p></section> : null}
            {selected.contents?.length ? <section><h3>Contents</h3><ul>{selected.contents.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
            {selected.notes ? <section><h3>Notes</h3><p>{selected.notes}</p></section> : null}
            {selected.sourceUrl ? <a href={selected.sourceUrl} rel="noreferrer" target="_blank">Open location link</a> : null}
            <button className={styles.popupFoundButton} onClick={() => onToggleFound(selected.id)} type="button">
              <i data-found={found.has(selected.id)} />
              {found.has(selected.id) ? "Marked as found" : "Mark as found"}
            </button>
          </article>
        </Popup>
      ) : null}
      <MapSynchronizer resetToken={resetToken} selected={selected} />
    </MapContainer>
  );
}
