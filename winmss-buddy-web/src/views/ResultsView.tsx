import React from "react";
import { Table } from "antd";

const ResultsView: React.FC = () => {
    const results = [
        { key: "1", name: "John Doe", points: 300 },
        { key: "2", name: "Jane Smith", points: 250 },
    ];

    return (
        <div>
            <h2>Championship Results</h2>
    <Table
    dataSource={results}
    columns={[
            { title: "Name", dataIndex: "name" },
    { title: "Points", dataIndex: "points" },
]}
    />
    </div>
);
};

export default ResultsView;
