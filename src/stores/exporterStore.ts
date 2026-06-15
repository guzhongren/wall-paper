import { create } from "zustand";

const { innerHeight, innerWidth } = window;
const initModel = {
  name: "PC",
  width: innerWidth,
  height: innerHeight,
};

export interface Model {
  name: string;
  width: number;
  height: number;
}

export interface ExporterState {
  currentMod: string;
  width: number;
  height: number;
  resolution: number;
  currentDirection: string;
  directions: string[];
  currentModel: string;
  models: Model[];
  changeWidth: (width: number) => void;
  changeHeight: (height: number) => void;
  changeResolution: (resolution: number) => void;
  changeCurrentModel: (currentModel: string) => void;
  changeCurrentDirection: (currentDirection: string) => void;
}

export const useExporterStore = create<ExporterState>((set) => ({
  currentMod: "template",
  width: initModel.width,
  height: initModel.height,
  resolution: window.devicePixelRatio,
  currentDirection: "vertical",
  directions: ["vertical", "horizon"],
  currentModel: initModel.name,
  models: [
    initModel,
    { name: "iPhone 11", width: 71.4, height: 144.0 },
    { name: "iPhone 11 Pro Max", width: 77.8, height: 158.0 },
  ],
  changeWidth: (width) => set({ width }),
  changeHeight: (height) => set({ height }),
  changeResolution: (resolution) => set({ resolution }),
  changeCurrentModel: (currentModel) =>
    set((state) => {
      const model = state.models.find((m) => m.name === currentModel);
      if (model) {
        return {
          currentModel,
          height: state.currentDirection === "vertical" ? model.height : model.width,
          width: state.currentDirection === "vertical" ? model.width : model.height,
        };
      }
      return { currentModel };
    }),
  changeCurrentDirection: (currentDirection) =>
    set((state) => ({
      currentDirection,
      width: state.height,
      height: state.width,
    })),
}));
