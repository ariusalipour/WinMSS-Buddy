// StagesTab.tsx
import React from "react";
import { Table } from "antd";
import { StageModel } from "../../models/StageModel";
import {MatchesController} from "../../controllers/MatchesController.ts";
import {MatchModel} from "../../models/MatchModel.ts";

interface StagesTabProps {
    match: MatchModel;
    matchesController: MatchesController;
}

const StagesTab: React.FC<StagesTabProps> = ({ match, matchesController }) => {
    const stageModels = matchesController.getStages(match.matchId);

    return (
        <Table<StageModel>
            dataSource={stageModels}
            rowKey="stageNumber" // Assuming stageNumber is unique
            columns={[
                {
                    title: "Stage No",
                    dataIndex: "stageNumber",
                    key: "stageNumber",
                    sorter: (a, b) => a.stageNumber - b.stageNumber,
                },
                {
                    title: "Stage Name",
                    dataIndex: "stageName",
                    key: "stageName",
                    sorter: (a, b) => a.stageName.localeCompare(b.stageName),
                },
                {
                    title: "Max Points",
                    dataIndex: "maxPoints",
                    key: "maxPoints",
                    sorter: (a, b) => a.maxPoints - b.maxPoints,
                },
                {
                    title: "No of Scores",
                    dataIndex: "scoreCount",
                    key: "scoreCount",
                    sorter: (a, b) => a.scoreCount - b.scoreCount,
                },
            ]}
            bordered
        />
    );
};

export default StagesTab;
