import React from "react";
import { Tabs, Table } from "antd";

const { TabPane } = Tabs;

const ViewView: React.FC = () => {
    const matches = [
        { key: "1", name: "Match 1", stages: 5 },
        { key: "2", name: "Match 2", stages: 3 },
    ];

    const stages = [
        { key: "1", name: "Stage 1", match: "Match 1" },
        { key: "2", name: "Stage 2", match: "Match 1" },
    ];

    const competitors = [
        { key: "1", name: "John Doe", region: "USA" },
        { key: "2", name: "Jane Smith", region: "UK" },
    ];

    const scores = [
        { key: "1", competitor: "John Doe", match: "Match 1", points: 95 },
        { key: "2", competitor: "Jane Smith", match: "Match 2", points: 85 },
    ];

    return (
        <Tabs defaultActiveKey="1">
        <TabPane tab="Matches" key="1">
    <Table dataSource={matches} columns={[{ title: "Name", dataIndex: "name" }]} />
    </TabPane>
    <TabPane tab="Stages" key="2">
    <Table dataSource={stages} columns={[{ title: "Name", dataIndex: "name" }]} />
    </TabPane>
    <TabPane tab="Competitors" key="3">
    <Table dataSource={competitors} columns={[{ title: "Name", dataIndex: "name" }]} />
    </TabPane>
    <TabPane tab="Scores" key="4">
    <Table dataSource={scores} columns={[{ title: "Competitor", dataIndex: "competitor" }]} />
    </TabPane>
    </Tabs>
);
};

export default ViewView;
