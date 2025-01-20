import React from "react";
import { Table } from "antd";
import { Registration } from "../../../../winmss-buddy-api/src/models/Registration";
import { SquadModel } from "../../models.ts";
import {Squad} from "../../../../winmss-buddy-api/src/models/Squad.ts";

const SquadsTab: React.FC<any> = ({ match, squads, registrations }) => {
    const dataSource = squads
        .filter((squad: Squad) => squad.matchId === match.matchId)
        .map((squad: Squad) => {
            const registrationCount = registrations.filter(
                (reg: Registration) => reg.squadId === squad.squadId
            ).length;

            return {
                key: squad.squadId,
                squadNo: squad.squadId,
                squadName: squad.squadName,
                noInSquad: registrationCount,
            };
        });

    return (
        <Table<SquadModel>
            dataSource={dataSource}
            rowKey="key"
            columns={[
                {
                    title: "SquadNo",
                    dataIndex: "squadNo",
                    key: "squadNo",
                    sorter: (a, b) => a.squadNo - b.squadNo,
                },
                {
                    title: "Squad Name",
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
    );
};

export default SquadsTab;
