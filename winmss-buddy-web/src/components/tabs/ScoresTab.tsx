import React, { useState } from "react";
import { Table, Select } from "antd";
import { Competitor, Registration, Score, Stage } from "../../../../winmss-buddy-api/src/models.ts";
import { ScoreModel } from "../../models"; // Import ScoreModel

const { Option } = Select;

const ScoresTab: React.FC<any> = ({ match, scores, stages, registrations, competitors }) => {
    const [selectedStageId, setSelectedStageId] = useState<number | "overall">("overall");
    const [selectedDivision, setSelectedDivision] = useState<string | "all">("all");
    const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

    const handleStageChange = (value: string) => {
        setSelectedStageId(value === "overall" ? "overall" : Number(value));
    };

    const handleDivisionChange = (value: string) => {
        setSelectedDivision(value === "all" ? "all" : value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value === "all" ? "all" : value);
    };

    // Filter scores based on selected stage, division, and category
    const filteredScores = scores
        .filter((score: Score) => score.matchId === match.matchId)
        .filter((score: Score) =>
            selectedStageId === "overall" || score.stageId === selectedStageId
        )
        .filter((score: Score) => {
            const registration = registrations.find(
                (reg: Registration) =>
                    reg.memberId === score.memberId && reg.matchId === score.matchId
            );
            return (
                (selectedDivision === "all" || String(registration?.divisionId) === selectedDivision) &&
                (selectedCategory === "all" || String(registration?.categoryId) === selectedCategory)
            );
        });

    // Get the highest hit factor for the selected stage
    const highestHitFactor =
        selectedStageId === "overall"
            ? 0
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
                key: `${score.stageId}-${score.memberId}`,
                stageNumber: stage?.stageId || "Overall",
                position: 0,
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
        .sort((a: ScoreModel, b: ScoreModel) => parseFloat(b.percentage) - parseFloat(a.percentage))
        .map((item: ScoreModel, index: number) => ({ ...item, position: index + 1 }));

    const uniqueDivisions = [
        ...new Set(registrations.map((reg: Registration) => String(reg.divisionId))),
    ];

    const uniqueCategories = [
        ...new Set(registrations.map((reg: Registration) => String(reg.categoryId))),
    ];

    return (
        <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <Select
                    value={selectedStageId === "overall" ? "overall" : selectedStageId.toString()}
                    style={{ width: 200 }}
                    onChange={handleStageChange}
                >
                    <Option key="overall" value="overall">
                        Overall Results
                    </Option>
                    {stages
                        .filter((stage: Stage) => stage.matchId === match.matchId)
                        .map((stage: Stage) => (
                            <Option key={String(stage.stageId)} value={String(stage.stageId)}>
                                {stage.stageName}
                            </Option>
                        ))}
                </Select>

                <Select
                    value={selectedDivision}
                    style={{ width: 200 }}
                    onChange={handleDivisionChange}
                >
                    <Option key="all" value="all">
                        All Divisions
                    </Option>
                    {uniqueDivisions.map((division) => (
                        <Option key={String(division)} value={String(division)}>
                            {String(division)}
                        </Option>
                    ))}
                </Select>

                <Select
                    value={selectedCategory}
                    style={{ width: 200 }}
                    onChange={handleCategoryChange}
                >
                    <Option key="all" value="all">
                        All Categories
                    </Option>
                    {uniqueCategories.map((category) => (
                        <Option key={String(category)} value={String(category)}>
                            {String(category)}
                        </Option>
                    ))}
                </Select>
            </div>

            <Table<ScoreModel>
                dataSource={dataSource}
                rowKey="key"
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
