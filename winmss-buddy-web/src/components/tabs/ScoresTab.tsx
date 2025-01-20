import React, { useState } from "react";
import { Table, Select } from "antd";
import { Competitor, Registration, Score, Stage } from "../../../../winmss-buddy-api/src/models.ts";
import { ScoreModel } from "../../models"; // Import ScoreModel

const { Option } = Select;

const ScoresTab: React.FC<any> = ({ match, scores, stages, registrations, competitors }) => {
    const [selectedStageId, setSelectedStageId] = useState<number | "overall">("overall");

    const handleStageChange = (value: string) => {
        setSelectedStageId(value === "overall" ? "overall" : Number(value));
    };

    // Filter scores based on selected stage or show all if "Overall Results" is selected
    const filteredScores = selectedStageId === "overall"
        ? scores.filter((score: Score) => score.matchId === match.matchId)
        : scores.filter((score: Score) => score.stageId === selectedStageId && score.matchId === match.matchId);

    // Get the highest hit factor for the selected stage
    const highestHitFactor =
        selectedStageId === "overall"
            ? 0 // Set to 0 for "Overall Results"
            : Math.max(...filteredScores.map((score: Score) => score.hitFactor || 0), 0);

    // Generate the data source with Position and Percentage
    const dataSource: ScoreModel[] = filteredScores
        .map((score: Score) => {
            const stage: Stage = stages.find((stage: Stage) => stage.stageId === score.stageId);
            const registration: Registration = registrations.find(
                (reg: Registration) => reg.memberId === score.memberId && reg.matchId === score.matchId
            );
            const competitor = competitors.find((comp: Competitor) => comp.memberId === score.memberId);

            const percentage =
                highestHitFactor === 0
                    ? "N/A"
                    : ((score.hitFactor || 0) / highestHitFactor * 100).toFixed(2);

            return {
                key: `${score.stageId}-${score.memberId}`, // Unique key for each row
                stageNumber: stage?.stageId || "Overall",
                position: 0, // Temporary placeholder for position
                percentage,
                firstName: competitor?.firstname || "N/A",
                lastName: competitor?.lastname || "N/A",
                division: registration?.divisionId || "N/A",
                category: registration?.categoryId || "N/A",
                time: score.shootTime || "N/A",
                stagePoints: score.finalScore || "N/A",
                hitFactor: score.hitFactor ? score.hitFactor.toFixed(2) : "N/A",
                alpha: score.scoreA || 0,
                beta: score.scoreB || 0,
                charlie: score.scoreC || 0,
                delta: score.scoreD || 0,
                mike: score.misses || 0,
                penalty: score.penalties || 0,
            };
        })
        .sort((a: ScoreModel, b: ScoreModel) => parseFloat(b.percentage) - parseFloat(a.percentage)) // Sort by percentage descending
        .map((item: ScoreModel, index: number) => ({ ...item, position: index + 1 })); // Add position field

    return (
        <div>
            <Select
                value={selectedStageId === "overall" ? "overall" : selectedStageId.toString()}
                style={{ width: 200, marginBottom: 16 }}
                onChange={handleStageChange}
            >
                <Option key="overall" value="overall">
                    Overall Results
                </Option>
                {stages
                    .filter((stage: Stage) => stage.matchId === match.matchId)
                    .map((stage: Stage) => (
                        <Option key={stage.stageId} value={stage.stageId.toString()}>
                            {stage.stageName}
                        </Option>
                    ))}
            </Select>
            <Table<ScoreModel>
                dataSource={dataSource}
                rowKey="key" // Use the unique key field
                columns={[
                    {
                        title: "Position",
                        dataIndex: "position",
                        key: "position",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.position - b.position,
                    },
                    {
                        title: "Percentage",
                        dataIndex: "percentage",
                        key: "percentage",
                        sorter: (a: ScoreModel, b: ScoreModel) => parseFloat(a.percentage) - parseFloat(b.percentage),
                    },
                    {
                        title: "Stage No",
                        dataIndex: "stageNumber",
                        key: "stageNumber",
                        sorter: (a: ScoreModel, b: ScoreModel) => Number(a.stageNumber) - Number(b.stageNumber),
                    },
                    {
                        title: "First Name",
                        dataIndex: "firstName",
                        key: "firstName",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.firstName.localeCompare(b.firstName),
                    },
                    {
                        title: "Last Name",
                        dataIndex: "lastName",
                        key: "lastName",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.lastName.localeCompare(b.lastName),
                    },
                    {
                        title: "Division",
                        dataIndex: "division",
                        key: "division",
                        sorter: (a: ScoreModel, b: ScoreModel) => String(a.division).localeCompare(String(b.division)),
                    },
                    {
                        title: "Category",
                        dataIndex: "category",
                        key: "category",
                        sorter: (a: ScoreModel, b: ScoreModel) => String(a.category).localeCompare(String(b.category)),
                    },
                    {
                        title: "Time",
                        dataIndex: "time",
                        key: "time",
                        sorter: (a: ScoreModel, b: ScoreModel) => Number(a.time) - Number(b.time),
                    },
                    {
                        title: "Stage Points",
                        dataIndex: "stagePoints",
                        key: "stagePoints",
                        sorter: (a: ScoreModel, b: ScoreModel) => Number(a.stagePoints) - Number(b.stagePoints),
                    },
                    {
                        title: "Hit Factor",
                        dataIndex: "hitFactor",
                        key: "hitFactor",
                        sorter: (a: ScoreModel, b: ScoreModel) => parseFloat(a.hitFactor) - parseFloat(b.hitFactor),
                    },
                    {
                        title: "Alpha",
                        dataIndex: "alpha",
                        key: "alpha",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.alpha - b.alpha,
                    },
                    {
                        title: "Beta",
                        dataIndex: "beta",
                        key: "beta",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.beta - b.beta,
                    },
                    {
                        title: "Charlie",
                        dataIndex: "charlie",
                        key: "charlie",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.charlie - b.charlie,
                    },
                    {
                        title: "Delta",
                        dataIndex: "delta",
                        key: "delta",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.delta - b.delta,
                    },
                    {
                        title: "Mike",
                        dataIndex: "mike",
                        key: "mike",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.mike - b.mike,
                    },
                    {
                        title: "Penalty",
                        dataIndex: "penalty",
                        key: "penalty",
                        sorter: (a: ScoreModel, b: ScoreModel) => a.penalty - b.penalty,
                    },
                ]}
                bordered
                scroll={{ x: "100%" }}
            />
        </div>
    );
};

export default ScoresTab;
