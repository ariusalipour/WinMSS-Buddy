import React, { useState } from "react";
import { Select, List, Card, Button, Row, Col } from "antd";
import { useAppContext } from "../context/AppContext";
import { MergeController } from "../controllers/mergeController.ts";

const { Option } = Select;

const MergeView: React.FC = () => {
    const { apiResponse } = useAppContext();
    const mergeController = new MergeController(apiResponse!);

    const competitors = mergeController.getCompetitors();
    const competitorMerges = mergeController.getCompetitorMerges();

    const [selectedMerges, setSelectedMerges] = useState<{ [key: number]: number[] }>({});

    const handleMergeChange = (memberId: number, mergeMemberIds: number[]) => {
        setSelectedMerges(prev => {
            const updatedMerges = { ...prev, [memberId]: mergeMemberIds };
            // Remove any merges that have no mergeMemberIds
            Object.keys(updatedMerges).forEach((key: string) => {
                if (updatedMerges[parseInt(key)].length === 0) {
                    delete updatedMerges[parseInt(key)];
                }
            });
            return updatedMerges;
        });
        mergeController.updateCompetitorMerge(memberId, mergeMemberIds);
    };

    const handleMergeButtonClick = async () => {
        try {
            await mergeController.processMerges();
            alert("Merges processed successfully!");
        } catch (error) {
            console.error("Error processing merges:", error);
            alert("Failed to process merges.");
        }
    };

    const handleClearMerges = () => {
        setSelectedMerges({});
        mergeController.clearAllMerges();
    };

    const hasMergesToBeMade = competitorMerges.some(merge => merge.mergeMemberIds.length > 0);

    const normalizeString = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const mergedIntoIds = competitorMerges.flatMap(merge => merge.mergeMemberIds);
    const mergedCompetitorIds = competitorMerges.map(merge => merge.memberId);

    return (
        <div>
            <Card title="Summary of Merges" style={{ marginBottom: "16px" }}>
                {competitorMerges
                    .filter(merge => merge.mergeMemberIds.length > 0)
                    .map(merge => {
                        const mainCompetitor = competitors.find(c => c.memberId === merge.memberId);
                        const mergedCompetitors = merge.mergeMemberIds.map(id => {
                            const competitor = competitors.find(c => c.memberId === id);
                            return competitor ? competitor.firstname + " " + competitor.lastname : "";
                        }).join(", ");

                        return (
                            <p key={merge.memberId}>
                                {mainCompetitor?.firstname + " " + mainCompetitor?.lastname} is merged with: {mergedCompetitors}
                            </p>
                        );
                    })}
                <Row justify="end">
                    <Button
                        type="primary"
                        disabled={!hasMergesToBeMade}
                        onClick={handleMergeButtonClick}
                        style={{ marginBottom: "16px" }}
                    >
                        Process Merges
                    </Button>
                    <Button
                        type="default"
                        onClick={handleClearMerges}
                        style={{ marginBottom: "16px", marginLeft: "8px" }}
                    >
                        Clear Merges
                    </Button>
                </Row>
            </Card>
            <List
                itemLayout="horizontal"
                dataSource={competitors}
                renderItem={competitor => {
                    const merge = competitorMerges.find(m => m.memberId === competitor.memberId);
                    const selectedMergeIds = merge ? merge.mergeMemberIds : [];
                    const selectedMergeNames = selectedMergeIds.map(id => {
                        const competitor = competitors.find(c => c.memberId === id);
                        return competitor ? competitor.firstname + " " + competitor.lastname : "";
                    });

                    return (
                        <List.Item>
                            <Row style={{ width: "100%" }}>
                                <Col span={12}>
                                    <List.Item.Meta
                                        title={competitor.firstname + " " + competitor.lastname}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Select
                                        mode="multiple"
                                        style={{ width: "100%" }}
                                        placeholder="Select competitors to merge"
                                        value={selectedMergeNames}
                                        onChange={value => {
                                            const ids = value.map(name => {
                                                const competitor = competitors.find(c => c.firstname + " " + c.lastname === name);
                                                return competitor ? competitor.memberId : null;
                                            }).filter(id => id !== null) as number[];
                                            handleMergeChange(competitor.memberId, ids);
                                        }}
                                        showSearch
                                        filterOption={(input, option) => {
                                            const children = option?.children as React.ReactNode;
                                            if (typeof children === "string") {
                                                return normalizeString(children).indexOf(normalizeString(input)) >= 0;
                                            }
                                            return false;
                                        }}
                                    >
                                        {competitors
                                            .filter(c => c.memberId !== competitor.memberId && !selectedMergeIds.includes(c.memberId) && !mergedIntoIds.includes(c.memberId) && !mergedCompetitorIds.includes(c.memberId))
                                            .map(c => (
                                                <Option key={c.memberId} value={c.firstname + " " + c.lastname}>
                                                    {c.firstname + " " + c.lastname}
                                                </Option>
                                            ))}
                                    </Select>
                                </Col>
                            </Row>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default MergeView;