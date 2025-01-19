import React from "react";
import { Tabs, Table } from "antd";
import { useAppContext } from "../context/AppContext";

const { TabPane } = Tabs;

const ViewView: React.FC = () => {
    const { processedData } = useAppContext();

    if (!processedData?.matches || processedData.matches.length === 0) {
        return <p>No matches to display. Upload data to view matches.</p>;
    }

    return (
        <div>
            <h2>View Matches</h2>
            <Tabs>
                {processedData.matches.map((match, matchIndex) => (
                    <TabPane tab={match.matchName} key={`match-${matchIndex}`}>
                        <Tabs defaultActiveKey="1">
                            {/* Competitors Tab */}
                            <TabPane tab="Competitors" key="1">
                                <Table
                                    dataSource={processedData.registrations
                                        .filter((reg) => reg.matchId === match.matchId)
                                        .map((reg) => {
                                            const competitor = processedData.competitors.find(
                                                (comp) => comp.memberId === reg.memberId
                                            );
                                            return competitor
                                                ? {
                                                    ...competitor,
                                                    registrationId: reg.competitorId, // Optional registration data
                                                }
                                                : null;
                                        })
                                        .filter((item) => item !== null)}
                                    columns={[
                                        { title: "Competitor Name", dataIndex: "name", key: "name" },
                                        { title: "Region", dataIndex: "region", key: "region" },
                                        { title: "Registration ID", dataIndex: "registrationId", key: "registrationId" },
                                    ]}
                                    bordered
                                />
                            </TabPane>

                            {/* Stages Tab */}
                            <TabPane tab="Stages" key="2">
                                <Table
                                    dataSource={processedData.stages.filter(
                                        (stage) => stage.matchId === match.matchId
                                    )}
                                    columns={[
                                        { title: "Stage Name", dataIndex: "stageName", key: "stageName" },
                                        { title: "Stage Number", dataIndex: "stageNumber", key: "stageNumber" },
                                    ]}
                                    bordered
                                />
                            </TabPane>

                            {/* Squads Tab */}
                            <TabPane tab="Squads" key="3">
                                <Table
                                    dataSource={processedData.squads.filter(
                                        (squad) => squad.matchId === match.matchId
                                    )}
                                    columns={[
                                        { title: "Squad Name", dataIndex: "squadName", key: "squadName" },
                                        { title: "Squad Number", dataIndex: "squadNumber", key: "squadNumber" },
                                    ]}
                                    bordered
                                />
                            </TabPane>

                            {/* Scores Tab */}
                            <TabPane tab="Scores" key="4">
                                <Table
                                    dataSource={processedData.scores.filter(
                                        (score) => score.matchId === match.matchId
                                    )}
                                    columns={[
                                        { title: "Competitor Name", dataIndex: "competitorName", key: "competitorName" },
                                        { title: "Score", dataIndex: "score", key: "score" },
                                        { title: "Time", dataIndex: "time", key: "time" },
                                    ]}
                                    bordered
                                />
                            </TabPane>
                        </Tabs>
                    </TabPane>
                ))}
            </Tabs>
        </div>
    );
};

export default ViewView;
