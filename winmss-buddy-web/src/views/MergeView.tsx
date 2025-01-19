import React from "react";
import { Table } from "antd";

const MergeView: React.FC = () => {
    const competitors = [
        { key: "1", name: "John Doe", region: "USA" },
        { key: "2", name: "Jane Smith", region: "UK" },
    ];

    return (
        <div>
            <h2>Merge Competitors</h2>
    <Table
    dataSource={competitors}
    columns={[{ title: "Name", dataIndex: "name" }]}
    />
    </div>
);
};

export default MergeView;
