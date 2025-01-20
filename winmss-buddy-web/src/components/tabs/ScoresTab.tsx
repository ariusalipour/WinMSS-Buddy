import React from "react";
import { Table } from "antd";
import {Competitor, Registration, Score, Stage} from "../../../../winmss-buddy-api/src/models.ts";

const ScoresTab: React.FC<any> = ({ match, scores, stages, registrations, competitors }) => {
    const dataSource = scores
        .filter((score: Score) => score.matchId === match.matchId)
        .map((score: Score) => {
            const stage: Stage = stages.find((stage: Stage) => stage.stageId === score.stageId);
            const registration: Registration = registrations.find(
                (reg: Registration) => reg.memberId === score.memberId && reg.matchId === score.matchId
            );
            const competitor = competitors.find((comp: Competitor) => comp.memberId === score.memberId);

            const percentage = "N/A"; // Need to find best way to calculate this with the filters

            return {
                stageNumber: stage?.stageId || "N/A",
                firstName: competitor?.firstname || "N/A",
                lastName: competitor?.lastname || "N/A",
                division: registration?.divisionId || "N/A",
                category: registration?.categoryId || "N/A",
                percentage,
                time: score.shootTime || "N/A",
                stagePoints: score.finalScore || "N/A",
                hitFactor: score.hitFactor.toFixed(2) || "N/A",
                alpha: score.scoreA || 0,
                beta: score.scoreB || 0,
                charlie: score.scoreC || 0,
                delta: score.scoreD || 0,
                mike: score.misses || 0,
                penalty: score.penalties || 0,
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
                    title: "Percentage",
                    dataIndex: "percentage",
                    key: "percentage",
                    sorter: (a, b) => parseFloat(a.percentage) - parseFloat(b.percentage),
                },
                {
                    title: "Time",
                    dataIndex: "time",
                    key: "time",
                    sorter: (a, b) => a.time - b.time,
                },
                {
                    title: "Stage Points",
                    dataIndex: "stagePoints",
                    key: "stagePoints",
                    sorter: (a, b) => a.stagePoints - b.stagePoints,
                },
                {
                    title: "Hit Factor",
                    dataIndex: "hitFactor",
                    key: "hitFactor",
                    sorter: (a, b) => a.hitFactor - b.hitFactor,
                },
                {
                    title: "Alpha",
                    dataIndex: "alpha",
                    key: "alpha",
                    sorter: (a, b) => a.alpha - b.alpha,
                },
                {
                    title: "Beta",
                    dataIndex: "beta",
                    key: "beta",
                    sorter: (a, b) => a.beta - b.beta,
                },
                {
                    title: "Charlie",
                    dataIndex: "charlie",
                    key: "charlie",
                    sorter: (a, b) => a.charlie - b.charlie,
                },
                {
                    title: "Delta",
                    dataIndex: "delta",
                    key: "delta",
                    sorter: (a, b) => a.delta - b.delta,
                },
                {
                    title: "Mike",
                    dataIndex: "mike",
                    key: "mike",
                    sorter: (a, b) => a.mike - b.mike,
                },
                {
                    title: "Penalty",
                    dataIndex: "penalty",
                    key: "penalty",
                    sorter: (a, b) => a.penalty - b.penalty,
                },
            ]}
            bordered
            scroll={{ x: "100%" }}
        />
    );
};

export default ScoresTab;
