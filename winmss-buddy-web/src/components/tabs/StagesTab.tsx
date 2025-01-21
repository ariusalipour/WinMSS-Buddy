import React from "react";
import { Table } from "antd";
import { Score } from "../../../../winmss-buddy-api/src/models/Score";
import {Stage} from "../../../../winmss-buddy-api/src/models/Stage.ts";
import {StageModel} from "../../models/StageModel.ts"; // Import StageModel

const StagesTab: React.FC<any> = ({ match, stages, scores }) => {
    const dataSource: StageModel[] = stages
        .filter((stage: Stage) => stage.matchId === match.matchId)
        .map((stage: Stage) => {
            const scoreCount = scores.filter(
                (score: Score) => score.stageId === stage.stageId && score.matchId === match.matchId
            ).length;

            return {
                key: stage.stageId,
                stageNumber: stage.stageId,
                stageName: stage.stageName,
                scoreCount,
            };
        });

    return (
        <Table<StageModel>
            dataSource={dataSource}
            rowKey="key" // Use the unique key field
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
