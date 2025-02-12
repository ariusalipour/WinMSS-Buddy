// SquadsTab.tsx
import React from "react";
import { Table } from "antd";
import { SquadModel } from "../../models/SquadModel";

interface SquadsTabProps {
    squadModels: SquadModel[];
}

const SquadsTab: React.FC<SquadsTabProps> = ({ squadModels }) => {
    return (
        <Table<SquadModel>
            dataSource={squadModels}
            rowKey="squadNo" // Assuming squadNo is unique
            columns={[
                {
                    title: "Squad No",
                    dataIndex: "squadNo",
                    key: "squadNo",
                    sorter: (a, b) => a.squadNo - b.squadNo,
                },
                {
                    title: "Squad Name",
                    dataIndex: "squadName",
                    key: "squadName",
                    sorter: (a, b) => a.squadName.localeCompare(b.squadName),
                },
                {
                    title: "No in Squad",
                    dataIndex: "noInSquad",
                    key: "noInSquad",
                    sorter: (a, b) => a.noInSquad - b.noInSquad,
                },
            ]}
            bordered
        />
    );
};

export default SquadsTab;
