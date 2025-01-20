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
                                                    (score) => score.stageId === stage.stageId
                                                ).length;

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
                                        dataSource={processedData.scores.filter(
                                            (score) => score.matchId === match.matchId
                                        )}
                                        columns={[
                                            {
                                                title: "Competitor Name",
                                                dataIndex: "competitorName",
                                                key: "competitorName",
                                                sorter: (a, b) => a.competitorName.localeCompare(b.competitorName),
                                            },
                                            {
                                                title: "Score",
                                                dataIndex: "score",
                                                key: "score",
                                                sorter: (a, b) => a.score - b.score,
                                            },
                                            {
                                                title: "Time",
                                                dataIndex: "time",
                                                key: "time",
                                                sorter: (a, b) => a.time - b.time,
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
