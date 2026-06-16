import { create } from "zustand";

export type CanvasSize = "A4" | "正方形" | "手机壁纸" | "PC";
export type Layout = "vertical" | "horizontal";
export type ExportPreset = "1080p" | "2K" | "4K" | "8K" | "custom";
export type ExportFormat = "png" | "jpeg";
export type ExportStatus =
  | "idle"
  | "preparing"
  | "rendering"
  | "encoding"
  | "ready"
  | "error";

interface CanvasDimensions {
  width: number;
  height: number;
}

export const CANVAS_DIMENSIONS: Record<CanvasSize, CanvasDimensions> = {
  A4: { width: 210, height: 297 },
  "正方形": { width: 210, height: 210 },
  "手机壁纸": { width: 77.8, height: 158 },
  PC: { width: 480, height: 270 },
};

function deriveDimensions(
  size: CanvasSize,
  layout: Layout,
): { width: number; height: number } {
  const dim = CANVAS_DIMENSIONS[size];
  if (layout === "horizontal") {
    return { width: dim.height, height: dim.width };
  }
  return { width: dim.width, height: dim.height };
}

export interface ExporterState {
  currentMod: string;
  width: number;
  height: number;
  canvasSize: CanvasSize;
  layout: Layout;

  exportPreset: ExportPreset;
  customWidth: number;
  customHeight: number;
  dpi: number;
  format: ExportFormat;
  jpegQuality: number;

  exportStatus: ExportStatus;
  exportProgress: number;

  changeCanvasSize: (size: CanvasSize) => void;
  changeLayout: (layout: Layout) => void;
  setExportPreset: (preset: ExportPreset) => void;
  setCustomDimensions: (width: number, height: number) => void;
  setDpi: (dpi: number) => void;
  setFormat: (format: ExportFormat) => void;
  setJpegQuality: (quality: number) => void;
  setExportStatus: (status: ExportStatus, progress?: number) => void;
}

const defaultSize: CanvasSize = "A4";
const defaultDims = deriveDimensions(defaultSize, "vertical");

export const useExporterStore = create<ExporterState>((set) => ({
  currentMod: "template",
  width: defaultDims.width,
  height: defaultDims.height,
  canvasSize: defaultSize,
  layout: "vertical",

  exportPreset: "4K",
  customWidth: 3840,
  customHeight: 2160,
  dpi: 72,
  format: "png",
  jpegQuality: 0.92,

  exportStatus: "idle",
  exportProgress: 0,

  changeCanvasSize: (canvasSize) =>
    set((state) => ({
      canvasSize,
      ...deriveDimensions(canvasSize, state.layout),
    })),

  changeLayout: (layout) =>
    set((state) => ({
      layout,
      width: state.height,
      height: state.width,
    })),

  setExportPreset: (exportPreset) => set({ exportPreset }),

  setCustomDimensions: (width, height) =>
    set({ customWidth: width, customHeight: height }),

  setDpi: (dpi) => set({ dpi }),

  setFormat: (format) => set({ format }),

  setJpegQuality: (jpegQuality) => set({ jpegQuality }),

  setExportStatus: (exportStatus, progress = 0) =>
    set({ exportStatus, exportProgress: progress }),
}));
