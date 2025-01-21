// winmss-buddy-web/src/views/CompetitorsTab.ts

import React from "react";
import { Table } from "antd";
import { CompetitorModel } from "../../models/CompetitorModel";
import { CompetitorController } from "../../controllers/CompetitorController";

const CompetitorsTab: React.FC = () => {
    // Fetch competitor data via CompetitorController
    const competitors = CompetitorController.getCompetitors();

    return (
        <Table<CompetitorModel>
            dataSource={competitors}
            rowKey="key" // Use the unique key field
            columns={[
                {
                    title: "First Name",
                    dataIndex: "firstName",
                    key: "firstName",
                    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
                },
                {
                    title: "Last Name",
                    dataIndex: "lastName",
                    key: "lastName",
                    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
                },
                {
                    title: "Division",
                    dataIndex: "division",
                    key: "division",
                    sorter: (a, b) => a.division - b.division,
                },
                {
                    title: "Category",
                    dataIndex: "category",
                    key: "category",
                    sorter: (a, b) => a.category - b.category,
                },
                {
                    title: "Region",
                    dataIndex: "region",
                    key: "region",
                    sorter: (a, b) => a.region - b.region,
                },
                {
                    title: "Class",
                    dataIndex: "class",
                    key: "class",
                    sorter: (a, b) => a.class - b.class,
                },
                {
                    title: "Squad",
                    dataIndex: "squadName",
                    key: "squadName",
                    sorter: (a, b) => a.squadName.localeCompare(b.squadName),
                },
            ]}
            bordered
        />
    );
};

export default CompetitorsTab;
