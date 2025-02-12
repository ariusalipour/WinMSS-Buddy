// ScoresTab.tsx
import React, { useState, useMemo } from "react";
import { Table, Select } from "antd";
import { ScoreModel } from "../../models/ScoreModel";
import { MatchesController } from "../../controllers/MatchesController";

const { Option } = Select;

interface ScoresTabProps {
    match: any;
    matchesController: MatchesController;
}

const ScoresTab: React.FC<ScoresTabProps> = ({ match, matchesController }) => {
    const [selectedStageId, setSelectedStageId] = useState<number | "overall">("overall");
    const [selectedDivision, setSelectedDivision] = useState<string | "all">("all");
    const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

    const handleStageChange = (value: string) => {
        setSelectedStageId(value === "overall" ? "overall" : Number(value));
    };

    const handleDivisionChange = (value: string) => {
        setSelectedDivision(value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    // Get unique divisions and categories (assume these helper methods are added to MatchesController)
    const uniqueDivisions = matchesController.getUniqueDivisions(match.matchId);
    const uniqueCategories = matchesController.getUniqueCategories(match.matchId);

    // Retrieve stage models for the stage dropdown
    const stageModels = matchesController.getStages(match.matchId);

    // Re-calculate the filtered scores every time a filter changes
    const scoreModels: ScoreModel[] = useMemo(() => {
        return matchesController.getScores(
            match.matchId,
            selectedStageId === "overall" ? undefined : selectedStageId,
            selectedDivision === "all" ? undefined : Number(selectedDivision),
            selectedCategory === "all" ? undefined : Number(selectedCategory)
        );
    }, [
        match.matchId,
        selectedStageId,
        selectedDivision,
        selectedCategory,
        matchesController,
    ]);

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
                    {stageModels.map((stage) => (
                        <Option key={String(stage.stageNumber)} value={String(stage.stageNumber)}>
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
                        <Option key={division} value={division}>
                            {division}
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
                        <Option key={category} value={category}>
                            {category}
                        </Option>
                    ))}
                </Select>
            </div>

            <Table<ScoreModel>
                dataSource={scoreModels}
                rowKey="position" // Ensure this is unique per score model (or use a dedicated key field)
                columns={[
                    {
                        title: "Position",
                        dataIndex: "position",
                        key: "position",
                        sorter: (a, b) => a.position - b.position,
                    },
                    {
                        title: "Percentage",
                        dataIndex: "percentage",
                        key: "percentage",
                        sorter: (a, b) =>
                            parseFloat(a.percentage) - parseFloat(b.percentage),
                    },
                    {
                        title: "Stage No",
                        dataIndex: "stageNumber",
                        key: "stageNumber",
                        sorter: (a, b) =>
                            Number(a.stageNumber) - Number(b.stageNumber),
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
                        sorter: (a, b) =>
                            String(a.division).localeCompare(String(b.division)),
                    },
                    {
                        title: "Category",
                        dataIndex: "category",
                        key: "category",
                        sorter: (a, b) =>
                            String(a.category).localeCompare(String(b.category)),
                    },
                    {
                        title: "Time",
                        dataIndex: "time",
                        key: "time",
                        sorter: (a, b) => Number(a.time) - Number(b.time),
                    },
                    {
                        title: "Stage Points",
                        dataIndex: "points",
                        key: "points",
                        sorter: (a, b) => Number(a.points) - Number(b.points),
                    },
                    {
                        title: "Hit Factor",
                        dataIndex: "hitFactor",
                        key: "hitFactor",
                        sorter: (a, b) => Number(a.hitFactor) - Number(b.hitFactor),
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
        </div>
    );
};

export default ScoresTab;
