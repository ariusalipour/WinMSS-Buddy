// SquadsTab.tsx
import React from "react";
import { Table } from "antd";
import { SquadModel } from "../../models/SquadModel";
import {MatchesController} from "../../controllers/MatchesController.ts";
import {MatchModel} from "../../models/MatchModel.ts";

interface SquadsTabProps {
    match: MatchModel;
    matchesController: MatchesController;
}

const SquadsTab: React.FC<SquadsTabProps> = ({ match, matchesController }) => {
    const squadModels = matchesController.getSquads(match.matchId);

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
