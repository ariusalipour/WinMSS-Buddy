import React from "react";
import { Table } from "antd";
import {Score, Stage} from "../../../../winmss-buddy-api/src/models.ts";

const StagesTab: React.FC<any> = ({ match, stages, scores }) => {
    const dataSource = stages
        .filter((stage: Stage) => stage.matchId === match.matchId)
        .map((stage: Stage) => {
            const scoreCount = scores.filter(
                (score: Score) => score.stageId === stage.stageId && score.matchId === match.matchId
            ).length;

            return {
                stageNumber: stage.stageId,
                stageName: stage.stageName,
                scoreCount,
            };
        });

    return (
        <Table
            dataSource={dataSource}
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
