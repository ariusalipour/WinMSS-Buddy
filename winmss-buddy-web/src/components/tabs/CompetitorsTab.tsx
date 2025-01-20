import React from "react";
import { Table } from "antd";
import { Registration } from "../../../../winmss-buddy-api/src/models/Registration";
import { CompetitorModel } from "../../models";
import {Competitor} from "../../../../winmss-buddy-api/src/models/Competitor.ts";
import {Squad} from "../../../../winmss-buddy-api/src/models/Squad.ts"; // Import CompetitorModel

const CompetitorsTab: React.FC<any> = ({ match, registrations, competitors, squads }) => {
    const dataSource: CompetitorModel[] = registrations
        .filter((reg: Registration) => reg.matchId === match.matchId)
        .map((reg: Registration) => {
            const competitor = competitors.find((comp: Competitor) => comp.memberId === reg.memberId);
            const squad = squads.find((squad: Squad) => squad.squadId === reg.squadId);

            return competitor
                ? {
                    key: `${reg.matchId}-${reg.memberId}`, // Ensure unique key
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
        .filter((item: CompetitorModel): item is CompetitorModel => item !== null);

    return (
        <Table<CompetitorModel>
            dataSource={dataSource}
            rowKey="key" // Use the unique key field
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
    );
};

export default CompetitorsTab;
