import { useState } from "react";
import { Card, Tabs, Button } from "antd";
import "./index.scss";
import Template from "../Template";
import QualityPanel from "./QualityPanel";
import { useHighResExport } from "../../hooks/useHighResExport";
import { useExporterStore } from "../../stores/exporterStore";

const { TabPane } = Tabs;

const Exporter = () => {
  const [downloading, setDownloading] = useState(false);
  const { exportStatus, exportProgress, setExportStatus } = useExporterStore();
  const { exportMap } = useHighResExport();

  const isExporting =
    exportStatus !== "idle" &&
    exportStatus !== "ready" &&
    exportStatus !== "error";

  async function handleDownload() {
    setDownloading(true);
    try {
      const blob = await exportMap();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "map.png";
        anchor.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // exportMap already sets error status
    } finally {
      setDownloading(false);
      setTimeout(() => setExportStatus("idle"), 3000);
    }
  }

  function getButtonText() {
    if (!isExporting && !downloading) return "Download ↓";
    if (exportStatus === "preparing") return "准备渲染...";
    if (exportStatus === "rendering") return "渲染中...";
    if (exportStatus === "encoding") return "编码中...";
    if (exportStatus === "ready") return "导出完成";
    return "Download ↓";
  }

  return (
    <div className="exporter">
      <Card title="导出设置" bordered={false}>
        <Tabs defaultActiveKey="preset" className="tabContainer">
          <TabPane tab="预设" key="preset">
            <Template />
          </TabPane>
          <TabPane tab="画质" key="quality">
            <QualityPanel />
          </TabPane>
          <TabPane tab="自定义" key="custom">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
        <Button
          type="primary"
          block
          onClick={handleDownload}
          disabled={downloading || isExporting}
          loading={downloading || isExporting}
        >
          {getButtonText()}
        </Button>
      </Card>
    </div>
  );
};

export default Exporter;
