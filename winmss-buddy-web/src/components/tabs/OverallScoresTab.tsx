import React, { useState } from "react";
import { Table, Select } from "antd";
import { OverallScoreModel } from "../../models/OverallScoreModel";
import { MatchesController } from "../../controllers/MatchesController";
import { MatchModel } from "../../models/MatchModel";

const { Option } = Select;

interface OverallScoresTabProps {
    match: MatchModel;
    matchesController: MatchesController;
}

const OverallScoresTab: React.FC<OverallScoresTabProps> = ({ match, matchesController }) => {
    const [selectedDivision, setSelectedDivision] = useState<string | "all">("all");
    const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

    const uniqueDivisions = matchesController.getUniqueDivisions(match.matchId);
    const uniqueCategories = matchesController.getUniqueCategories(match.matchId);

    const overallScores = matchesController.getOverallScores(
        match.matchId,
        selectedDivision === "all" ? undefined : Number(selectedDivision),
        selectedCategory === "all" ? undefined : Number(selectedCategory)
    );

    const handleDivisionChange = (value: string) => {
        setSelectedDivision(value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
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
            <Table<OverallScoreModel>
                dataSource={overallScores}
                rowKey="position"
                columns={[
                    { title: "Position", dataIndex: "position", key: "position", sorter: (a, b) => a.position - b.position },
                    { title: "First Name", dataIndex: "firstName", key: "firstName", sorter: (a, b) => a.firstName.localeCompare(b.firstName) },
                    { title: "Last Name", dataIndex: "lastName", key: "lastName", sorter: (a, b) => a.lastName.localeCompare(b.lastName) },
                    { title: "Percentage", dataIndex: "percentage", key: "percentage", sorter: (a, b) => parseFloat(a.percentage) - parseFloat(b.percentage), render: (text: string) => parseFloat(text).toFixed(2) },
                    { title: "Stage Points", dataIndex: "stagePoints", key: "stagePoints", sorter: (a, b) => Number(a.stagePoints) - Number(b.stagePoints), render: (text: number) => text.toFixed(2) },
                    { title: "Points", dataIndex: "points", key: "points", sorter: (a, b) => Number(a.points) - Number(b.points), render: (text: number) => text.toFixed(2) },
                    { title: "Time", dataIndex: "time", key: "time", sorter: (a, b) => Number(a.time) - Number(b.time), render: (text: number) => text.toFixed(2) },
                    { title: "Division", dataIndex: "division", key: "division", sorter: (a, b) => String(a.division).localeCompare(String(b.division)) },
                    { title: "Class", dataIndex: "class", key: "class", sorter: (a, b) => String(a.class).localeCompare(String(b.class)) },
                    { title: "Category", dataIndex: "category", key: "category", sorter: (a, b) => String(a.category).localeCompare(String(b.category)) },
                    { title: "Power Factor", dataIndex: "powerFactor", key: "powerFactor", sorter: (a, b) => String(a.powerFactor).localeCompare(String(b.powerFactor)) },
                    { title: "Alpha", dataIndex: "alpha", key: "alpha", sorter: (a, b) => a.alpha - b.alpha },
                    { title: "Bravo", dataIndex: "beta", key: "beta", sorter: (a, b) => a.beta - b.beta },
                    { title: "Charlie", dataIndex: "charlie", key: "charlie", sorter: (a, b) => a.charlie - b.charlie },
                    { title: "Delta", dataIndex: "delta", key: "delta", sorter: (a, b) => a.delta - b.delta },
                    { title: "Mike", dataIndex: "mike", key: "mike", sorter: (a, b) => a.mike - b.mike },
                    { title: "No Shoot", dataIndex: "noShoot", key: "noShoot", sorter: (a, b) => a.noShoot - b.noShoot },
                    { title: "Procedural", dataIndex: "procedural", key: "procedural", sorter: (a, b) => a.procedural - b.procedural },
                ]}
                bordered
                scroll={{ x: "100%" }}
            />
        </div>
    );
};

export default OverallScoresTab;