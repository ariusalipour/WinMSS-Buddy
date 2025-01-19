import React from "react";
import { Table } from "antd";
import { useAppContext } from "../context/AppContext";

const ResultsView: React.FC = () => {
    const { championshipResults } = useAppContext();

    const columns = [
        { title: "Last Name", dataIndex: "lastname", key: "lastname" },
        { title: "First Name", dataIndex: "firstname", key: "firstname" },
        { title: "Total Score", dataIndex: "totalScore", key: "totalScore" },
    ];

    return (
        <div>
            <h2>Championship Results</h2>
            <Table
                dataSource={(championshipResults || []).map((result, index) => ({
                    ...result,
                    key: index,
                }))}
                columns={columns}
                bordered
            />
        </div>
    );
};

export default ResultsView;
