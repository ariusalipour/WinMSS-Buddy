// src/views/MatchesView.tsx
import React from "react";
import { Tabs } from "antd";
import CompetitorsTab from "../components/tabs/CompetitorsTab";
import StagesTab from "../components/tabs/StagesTab";
import SquadsTab from "../components/tabs/SquadsTab";
import ScoresTab from "../components/tabs/ScoresTab";
import { useMatchesController } from "../hooks/useMatchesController";

const { TabPane } = Tabs;

const MatchesView: React.FC = () => {
    // Get the controller from our custom hook.
    const matchesController = useMatchesController();

    // If no processed data is available, prompt the user to upload.
    if (!matchesController) {
        return <p>No matches to display. Please upload data to view matches.</p>;
    }

    // Retrieve the match view models.
    const matchModels = matchesController.getMatches();

    return (
        <div>
            <h2>Matches</h2>
            <Tabs>
                {matchModels.map((match, matchIndex) => {
                    // For each match, get the processed view models from the controller.
                    const competitorCount = matchesController.getCompetitorCount(match.matchId);
                    const stageCount = matchesController.getStageCount(match.matchId);
                    const squadCount = matchesController.getSquadCount(match.matchId);
                    const scoreCount = matchesController.getScoreCount(match.matchId);

                    return (
                        <TabPane tab={match.matchName} key={`match-${matchIndex}`}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={`Competitors (${competitorCount})`} key="1">
                                    <CompetitorsTab match={match} matchesController={matchesController} />
                                </TabPane>
                                <TabPane tab={`Stages (${stageCount})`} key="2">
                                    <StagesTab match={match} matchesController={matchesController} />
                                </TabPane>
                                <TabPane tab={`Squads (${squadCount})`} key="3">
                                    <SquadsTab match={match} matchesController={matchesController} />
                                </TabPane>
                                <TabPane tab={`Scores (${scoreCount})`} key="4">
                                    <ScoresTab match={match} matchesController={matchesController} />
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
