// CompetitorsTab.tsx
import React from "react";
import { Table } from "antd";
import { CompetitorModel } from "../../models/CompetitorModel";

interface CompetitorsTabProps {
    competitorModels: CompetitorModel[];
}

const CompetitorsTab: React.FC<CompetitorsTabProps> = ({ competitorModels }) => {
    return (
        <Table<CompetitorModel>
            dataSource={competitorModels}
            rowKey="competitorId" // Use a unique identifier from your view model
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
                    sorter: (a, b) => a.region.localeCompare(b.region),
                },
                {
                    title: "Class",
                    dataIndex: "class",
                    key: "class",
                    sorter: (a, b) => a.class.localeCompare(b.class),
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
