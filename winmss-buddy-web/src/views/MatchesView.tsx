import React from "react";
import { Tabs, Table } from "antd";
import { useAppContext } from "../context/AppContext";

const { TabPane } = Tabs;

const MatchesView: React.FC = () => {
    const { processedData } = useAppContext();

    if (!processedData?.matches || processedData.matches.length === 0) {
        return <p>No matches to display. Upload data to view matches.</p>;
    }

    return (
        <div>
            <h2>Matches</h2>
            <Tabs>
                {processedData.matches.map((match, matchIndex) => {
                    // Count related data for the current match
                    const competitorCount = processedData.registrations.filter(
                        (reg) => reg.matchId === match.matchId
                    ).length;
                    const stageCount = processedData.stages.filter(
                        (stage) => stage.matchId === match.matchId
                    ).length;
                    const squadCount = processedData.squads.filter(
                        (squad) => squad.matchId === match.matchId
                    ).length;
                    const scoreCount = processedData.scores.filter(
                        (score) => score.matchId === match.matchId
                    ).length;

                    return (
                        <TabPane tab={match.matchName} key={`match-${matchIndex}`}>
                            <Tabs defaultActiveKey="1">
                                {/* Competitors Tab */}
                                <TabPane tab={`Competitors (${competitorCount})`} key="1">
                                    <Table
                                        dataSource={processedData.registrations
                                            .filter((reg) => reg.matchId === match.matchId)
                                            .map((reg) => {
                                                const competitor = processedData.competitors.find(
                                                    (comp) => comp.memberId === reg.memberId
                                                );

                                                const squad = processedData.squads.find(
                                                    (squad) => squad.squadId === reg.squadId
                                                );

                                                return competitor
                                                    ? {
                                                        firstName: competitor.firstname,
                                                        lastName: competitor.lastname,
                                                        division: reg.divisionId,
                                                        category: reg.categoryId,
                                                        region: competitor.regionId,
                                                        class: competitor.classId,
                                                        squadName: squad?.squadName || "N/A",
                                                    }
                                                    : null;
                                            })
                                            .filter((item) => item !== null)}
                                        columns={[
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
                                                title: "Region",
                                                dataIndex: "region",
                                                key: "region",
                                                sorter: (a, b) => a.region - b.region,
                                            },
                                            {
                                                title: "Class",
                                                dataIndex: "class",
                                                key: "class",
                                                sorter: (a, b) => a.class - b.class,
                                            },
                                            {
                                                title: "Squad",
                                                dataIndex: "squadName",
                                                key: "squadName",
                                                sorter: (a, b) => a.squadName.localeCompare(b.squadName),
                                            },
                                        ]}
                                        bordered
                                    />
                                </TabPane>

                                {/* Stages Tab */}
                                <TabPane tab={`Stages (${stageCount})`} key="2">
                                    <Table
                                        dataSource={processedData.stages
                                            .filter((stage) => stage.matchId === match.matchId)
                                            .map((stage) => {
                                                const scoreCount = processedData.scores.filter(
                                                    (score) => score.stageId === stage.stageId && score.matchId === match.matchId
                                                ).length; // Filter scores by both stageId and matchId

                                                return {
                                                    stageNumber: stage.stageId,
                                                    stageName: stage.stageName,
                                                    scoreCount,
                                                };
                                            })}
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
                                </TabPane>

                                {/* Squads Tab */}
                                <TabPane tab={`Squads (${squadCount})`} key="3">
                                    <Table
                                        dataSource={processedData.squads
                                            .filter((squad) => squad.matchId === match.matchId)
                                            .map((squad) => {
                                                const registrationCount = processedData.registrations.filter(
                                                    (reg) => reg.squadId === squad.squadId
                                                ).length;

                                                return {
                                                    squadName: squad.squadName,
                                                    noInSquad: registrationCount,
                                                };
                                            })}
                                        columns={[
                                            {
                                                title: "Squad Name/No",
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
                                </TabPane>

                                {/* Scores Tab */}
                                <TabPane tab={`Scores (${scoreCount})`} key="4">
                                    <Table
                                        scroll={{ x: "100%" }}
                                        dataSource={processedData.scores
                                            .filter((score) => score.matchId === match.matchId)
                                            .map((score) => {
                                                const stage = processedData.stages.find(
                                                    (stage) => stage.stageId === score.stageId
                                                );
                                                const registration = processedData.registrations.find(
                                                    (reg) =>
                                                        reg.memberId === score.memberId &&
                                                        reg.matchId === score.matchId
                                                );
                                                const competitor = processedData.competitors.find(
                                                    (comp) => comp.memberId === score.memberId
                                                );

                                                const percentage =
                                                    score.stagePoints && score.totalStagePoints
                                                        ? ((score.stagePoints / score.totalStagePoints) * 100).toFixed(2)
                                                        : "N/A";

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
                                            })}
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
                                    />
                                </TabPane>
                            </Tabs>
                        </TabPane>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default MatchesView;
