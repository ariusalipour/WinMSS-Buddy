import React from "react";
import { Tabs } from "antd";
import { useAppContext } from "../context/AppContext";
import CompetitorsTab from "../components/tabs/CompetitorsTab.tsx";
import StagesTab from "../components/tabs/StagesTab.tsx";
import SquadsTab from "../components/tabs/SquadsTab.tsx";
import ScoresTab from "../components/tabs/ScoresTab";

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
                                <TabPane tab={`Competitors (${competitorCount})`} key="1">
                                    <CompetitorsTab
                                        match={match}
                                        registrations={processedData.registrations}
                                        competitors={processedData.competitors}
                                        squads={processedData.squads}
                                    />
                                </TabPane>
                                <TabPane tab={`Stages (${stageCount})`} key="2">
                                    <StagesTab
                                        match={match}
                                        stages={processedData.stages}
                                        scores={processedData.scores}
                                    />
                                </TabPane>
                                <TabPane tab={`Squads (${squadCount})`} key="3">
                                    <SquadsTab
                                        match={match}
                                        squads={processedData.squads}
                                        registrations={processedData.registrations}
                                    />
                                </TabPane>
                                <TabPane tab={`Scores (${scoreCount})`} key="4">
                                    <ScoresTab
                                        match={match}
                                        scores={processedData.scores}
                                        stages={processedData.stages}
                                        registrations={processedData.registrations}
                                        competitors={processedData.competitors}
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
