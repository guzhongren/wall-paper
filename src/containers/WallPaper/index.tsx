import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { mm2px } from "../../utils/mm2px";
import { useExporterStore } from "../../stores/exporterStore";
import "./index.scss";
import Exporter from "../../components/Exporter";

declare global {
  interface Window {
    mapInstance: mapboxgl.Map;
  }
}

function WallPaper() {
  const [mapHeight, setHeight] = useState(window.innerHeight);
  const [mapWidth, setWidth] = useState(window.innerWidth);

  const mapRef = useRef<HTMLDivElement>(null);
  const { height, width } = useExporterStore();

  useEffect(() => {
    setHeight(mm2px(height));
    setWidth(mm2px(width));
  }, [height, width]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZ3V6aG9uZ3JlbiIsImEiOiJjajh0Z3ZvNXowbHF6MzNxenpoaTlqZnh0In0.UjqQlTKebjUEfWD6ZlVV7g";
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/guzhongren/ck9qomecy5v3z1is8k9cynq6r",
      center: [104.757, 35.116],
      zoom: 1,
      preserveDrawingBuffer: true,
    });
    window.mapInstance = mapInstance;
    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    window.mapInstance?.resize();
  }, [mapHeight, mapWidth]);

  return (
    <>
      <div
        id="map"
        ref={mapRef}
        className="map"
        style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}
      />
      <Exporter />
    </>
  );
}

export default WallPaper;
