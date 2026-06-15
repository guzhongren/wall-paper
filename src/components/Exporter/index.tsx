import { Card, Tabs, Button } from "antd";
import "./index.scss";
import Template from "../Template";

const { TabPane } = Tabs;

const Exporter = () => {
  function downloadWallPaper(evt: React.MouseEvent<HTMLButtonElement>) {
    const png = window.mapInstance.getCanvas().toDataURL("image/png");
    const anchor = (evt.currentTarget as HTMLElement).querySelector(
      "a",
    ) as HTMLAnchorElement | null;
    if (anchor) {
      anchor.href = png;
    }
  }

  return (
    <div className="exporter">
      <Card title="导出设置" bordered={false}>
        <Tabs defaultActiveKey="1" className="tabContainer">
          <TabPane tab="模板" key="1">
            <Template />
          </TabPane>
          <TabPane tab="自定义" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
        <Button type="primary" block onClick={downloadWallPaper}>
          <a href="" download="map.png">
            Download ↓
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default Exporter;
