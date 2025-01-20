import React from "react";
import { Table } from "antd";
import {Registration, Squad} from "../../../../winmss-buddy-api/src/models.ts";

const SquadsTab: React.FC<any> = ({ match, squads, registrations }) => {
    const dataSource = squads
        .filter((squad: Squad) => squad.matchId === match.matchId)
        .map((squad: Squad) => {
            const registrationCount = registrations.filter(
                (reg: Registration) => reg.squadId === squad.squadId
            ).length;

            return {
                squadName: squad.squadName,
                noInSquad: registrationCount,
            };
        });

    return (
        <Table
            dataSource={dataSource}
    columns={[
    {
        title: "Squad Name",
            dataIndex: "squadName",
        key: "squadName",
        sorter: (a: Squad, b) => a.squadName.localeCompare(b.squadName),
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
);
};

export default SquadsTab;
