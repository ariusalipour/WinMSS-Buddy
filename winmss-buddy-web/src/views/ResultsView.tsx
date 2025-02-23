import { Select, Table, Typography } from "antd";
import { useMatchesController } from "../hooks/useMatchesController.ts";
import React, { useState } from "react";
import { MatchResult, ResultsModel } from "../models/ResultsModel.ts";
import { getCategoryString } from "../mappings/CategoryMappings.ts";
import { getDivisionString } from "../mappings/DivisionMappings.ts";

const { Option } = Select;
const { Title, Paragraph } = Typography;

const ResultsView: React.FC = () => {
    const matchesController = useMatchesController();

    if (!matchesController) {
        return <p>No matches to display. Please upload data to view matches.</p>;
    }

    const uniqueDivisions = matchesController.getUniqueDivisions();
    const uniqueCategories = matchesController.getUniqueCategories();
    const numberOfMatches = matchesController.getMatches().length;

    const [selectedBestOf, setSelectedBestOf] = useState<number>(1);
    const [selectedDivision, setSelectedDivision] = useState<string | "all">("all");
    const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

    const handleBestOfChange = (value: number) => {
        setSelectedBestOf(value);
    };

    const handleDivisionChange = (value: string) => {
        setSelectedDivision(value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const overallScoreModels = matchesController.getChampionshipResults(
        selectedBestOf,
        selectedDivision === "all" ? undefined : Number(selectedDivision),
        selectedCategory === "all" ? undefined : Number(selectedCategory)
    );

    return (
        <div>
            <Title>Results</Title>
            <Paragraph>This view allows you to see the results of the matches.</Paragraph>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <Select
                    value={selectedBestOf}
                    style={{ width: 200 }}
                    onChange={handleBestOfChange}
                >
                    {Array.from({ length: numberOfMatches }, (_, i) => i + 1).map((value) => (
                        <Option key={value} value={value}>
                            Best of {value}
                        </Option>
                    ))}
                </Select>
                <Select
                    value={selectedDivision}
                    style={{ width: 200 }}
                    onChange={handleDivisionChange}
                    placeholder="Select Division"
                >
                    <Option key="all" value="all">
                        All Divisions
                    </Option>
                    {uniqueDivisions.map((division) => (
                        <Option key={division} value={division}>
                            {getDivisionString(division)}
                        </Option>
                    ))}
                </Select>
                <Select
                    value={selectedCategory}
                    style={{ width: 200 }}
                    onChange={handleCategoryChange}
                    placeholder="Select Category"
                >
                    <Option key="all" value="all">
                        All Categories
                    </Option>
                    {uniqueCategories.map((category) => (
                        <Option key={category} value={category}>
                            {getCategoryString(category)}
                        </Option>
                    ))}
                </Select>
            </div>
            <Table<ResultsModel>
                dataSource={overallScoreModels}
                rowKey="competitorId"
                columns={[
                    {
                        title: "Position",
                        dataIndex: "position",
                        key: "position"
                    },
                    {
                        title: "Percentage",
                        dataIndex: "percentage",
                        key: "percentage"
                    },
                    {
                        title: "Competitor",
                        dataIndex: "memberId",
                        key: "competitorName"
                    },
                    {
                        title: "First Name",
                        dataIndex: "firstName",
                        key: "firstName"
                    },
                    {
                        title: "Last Name",
                        dataIndex: "lastName",
                        key: "lastName"
                    },
                    {
                        title: "Division",
                        dataIndex: "division",
                        key: "division"
                    },
                    {
                        title: "Category",
                        dataIndex: "category",
                        key: "category"
                    },
                    {
                        title: "Overall Score",
                        dataIndex: "percentageScore",
                        key: "overallScore"
                    },
                    {
                        title: "Match Results",
                        dataIndex: "matchResults",
                        key: "matchResults",
                        render: (matchResults) => (
                            <ul>
                                {matchResults.map((matchResult: MatchResult) => (
                                    <li key={matchResult.matchName}>
                                        <strong>{matchResult.matchName}</strong>: {matchResult.percentage}
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                ]}
                bordered
                scroll={{ x: "100%" }}
            />
        </div>
    );
};

export default ResultsView;