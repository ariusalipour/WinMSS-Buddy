import React, { useState, useEffect } from "react";
import { Select, Button, Row, Col, Typography } from "antd";
import { useAppContext } from "../context/AppContext";
import { MergeController } from "../controllers/MergeController.ts";

const { Option } = Select;
const { Title, Paragraph } = Typography;

const MergeView: React.FC = () => {
    const { apiResponse, setApiResponse } = useAppContext();

    if (!apiResponse) {
        return <div>No competitors to display. Please upload data to view matches.</div>;
    }

    const mergeController = new MergeController(apiResponse, setApiResponse);

    const competitors = mergeController.getCompetitors();
    const competitorMerges = mergeController.getCompetitorMerges();

    const [selectedMerges, setSelectedMerges] = useState<{ mainId: number, mergeIds: number[], prepopulated: boolean }[]>([]);

    useEffect(() => {
        const initialMerges = competitorMerges.map(merge => ({
            mainId: merge.memberId,
            mergeIds: merge.mergeMemberIds,
            prepopulated: true
        }));
        setSelectedMerges(initialMerges);
    }, [competitorMerges]);

    const handleAddRow = () => {
        setSelectedMerges([...selectedMerges, { mainId: 0, mergeIds: [], prepopulated: false }]);
    };

    const handleDeleteRow = (index: number) => {
        const updatedMerges = [...selectedMerges];
        const deletedMerge = updatedMerges.splice(index, 1)[0];
        setSelectedMerges(updatedMerges);
        mergeController.removeCompetitorMerge(deletedMerge.mainId);
    };

    const handleMainChange = (index: number, mainId: number) => {
        const updatedMerges = [...selectedMerges];
        updatedMerges[index].mainId = mainId;
        setSelectedMerges(updatedMerges);
    };

    const handleMergeChange = (index: number, mergeIds: number[]) => {
        const updatedMerges = [...selectedMerges];
        updatedMerges[index].mergeIds = mergeIds;
        setSelectedMerges(updatedMerges);
    };

    const handleMergeButtonClick = async () => {
        try {
            selectedMerges.forEach(({ mainId, mergeIds }) => {
                mergeController.updateCompetitorMerge(mainId, mergeIds);
            });
            await mergeController.processMerges();
            alert("Merges processed successfully!");
        } catch (error) {
            console.error("Error processing merges:", error);
            alert("Failed to process merges.");
        }
    };

    const handleClearMerges = () => {
        setSelectedMerges([]);
        mergeController.clearAllMerges();
    };

    const normalizeString = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const mergedIntoIds = selectedMerges.flatMap(merge => merge.mergeIds);
    const mergedCompetitorIds = selectedMerges.map(merge => merge.mainId);

    return (
        <div>
            <Title level={1}>Merge View</Title>
            <Paragraph>
                This view allows you to manage competitor merges. You can add new rows to create merges,
                select main competitors and competitors to merge, and process or clear all merges.
            </Paragraph>
            <Paragraph>Pre populated rows cannot be edited but can be deleted.</Paragraph>
            <Row justify="end" style={{ marginBottom: "16px" }}>
                <Button
                    type="primary"
                    onClick={handleMergeButtonClick}
                    style={{ marginRight: "8px" }}
                    disabled={selectedMerges.length === 0}
                >
                    Process Merges
                </Button>
                <Button
                    type="default"
                    onClick={handleClearMerges}
                    disabled={selectedMerges.length === 0}
                >
                    Clear Merges
                </Button>
            </Row>
            <Button
                type="dashed"
                onClick={handleAddRow}
                style={{ marginBottom: "16px" }}
            >
                Add Row
            </Button>
            {selectedMerges.map((merge, index) => (
                <Row key={index} style={{ marginBottom: "16px" }} align="middle">
                    <Col span={10}>
                        <Select
                            style={{ width: "100%", pointerEvents: merge.prepopulated ? "none" : "auto" }}
                            placeholder="Select main competitor"
                            value={merge.mainId ? `${competitors.find(c => c.memberId === merge.mainId)?.firstname} ${competitors.find(c => c.memberId === merge.mainId)?.lastname}` : undefined}
                            onChange={value => handleMainChange(index, competitors.find(c => `${c.firstname} ${c.lastname}` === value)?.memberId || 0)}
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
                                .filter(c => !mergedIntoIds.includes(c.memberId) && !mergedCompetitorIds.includes(c.memberId))
                                .map(c => (
                                    <Option key={c.memberId} value={`${c.firstname} ${c.lastname}`}>
                                        {c.firstname + " " + c.lastname}
                                    </Option>
                                ))}
                        </Select>
                    </Col>
                    <Col span={10}>
                        <Select
                            mode="multiple"
                            style={{ width: "100%", pointerEvents: merge.prepopulated ? "none" : "auto" }}
                            placeholder="Select competitors to merge"
                            value={merge.mergeIds.map(id => `${competitors.find(c => c.memberId === id)?.firstname} ${competitors.find(c => c.memberId === id)?.lastname}`)}
                            onChange={value => handleMergeChange(index, value.map(name => competitors.find(c => `${c.firstname} ${c.lastname}` === name)?.memberId || 0))}
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
                                .filter(c => c.memberId !== merge.mainId && !mergedIntoIds.includes(c.memberId) && !mergedCompetitorIds.includes(c.memberId))
                                .map(c => (
                                    <Option key={c.memberId} value={`${c.firstname} ${c.lastname}`}>
                                        {c.firstname + " " + c.lastname}
                                    </Option>
                                ))}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Button type="default" danger onClick={() => handleDeleteRow(index)}>
                            Delete
                        </Button>
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default MergeView;