import { useCallback, useRef } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import { useExporterStore } from "../stores/exporterStore";
import { getExportPixels } from "../utils/dimensions";

export function useHighResExport() {
  const tempMapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cleanup = useCallback(() => {
    if (tempMapRef.current) {
      tempMapRef.current.remove();
      tempMapRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.remove();
      containerRef.current = null;
    }
  }, []);

  const exportMap = useCallback(async (): Promise<Blob | null> => {
    const mainMap = window.mapInstance;
    if (!mainMap) return null;

    const { exportPreset, customWidth, customHeight, format, jpegQuality } =
      useExporterStore.getState();

    const container = mainMap.getContainer();
    const previewWidth = container.clientWidth;
    const previewHeight = container.clientHeight;
    const previewBounds = mainMap.getBounds();

    const pixels = getExportPixels(
      exportPreset,
      customWidth,
      customHeight,
      previewWidth,
      previewHeight,
    );
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";

    cleanup();

    const { setExportStatus } = useExporterStore.getState();
    setExportStatus("preparing", 10);

    const hiddenDiv = document.createElement("div");
    hiddenDiv.style.cssText = `position:fixed;left:-9999px;top:0;width:${pixels.width}px;height:${pixels.height}px`;
    document.body.appendChild(hiddenDiv);
    containerRef.current = hiddenDiv;

    try {
      setExportStatus("rendering", 30);

      const tempMap = new mapboxgl.Map({
        container: hiddenDiv,
        style: "mapbox://styles/guzhongren/ck9qomecy5v3z1is8k9cynq6r",
        center: mainMap.getCenter(),
        zoom: mainMap.getZoom(),
        pitch: mainMap.getPitch(),
        bearing: mainMap.getBearing(),
        interactive: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
      });
      tempMapRef.current = tempMap;

      await new Promise<void>((resolve) => {
        tempMap.once("load", () => {
          tempMap.fitBounds(previewBounds, { duration: 0, linear: true });
          tempMap.once("idle", () => {
            requestAnimationFrame(() => resolve());
          });
        });
      });

      setExportStatus("encoding", 70);

      const canvas = tempMap.getCanvas();
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b: Blob | null) => resolve(b!),
          mimeType,
          format === "jpeg" ? jpegQuality : undefined,
        );
      });

      setExportStatus("ready", 100);
      return blob;
    } catch (err) {
      setExportStatus("error", 0);
      throw err;
    } finally {
      cleanup();
    }
  }, [cleanup]);

  return { exportMap, cleanup };
}
