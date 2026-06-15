import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./index.scss";
import WallPaper from "./containers/WallPaper";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WallPaper />
  </StrictMode>,
);
