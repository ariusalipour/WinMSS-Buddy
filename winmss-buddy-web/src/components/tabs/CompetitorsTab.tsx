import React from "react";
import { Table } from "antd";
import {Competitor, Registration, Squad} from "../../../../winmss-buddy-api/src/models.ts";

const CompetitorsTab: React.FC<any> = ({ match, registrations, competitors, squads }) => {
    const dataSource = registrations
        .filter((reg: Registration) => reg.matchId === match.matchId)
        .map((reg: Registration) => {
            const competitor = competitors.find((comp: Competitor) => comp.memberId === reg.memberId);
            const squad = squads.find((squad: Squad) => squad.squadId === reg.squadId);

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
        .filter((item) => item !== null);

    return (
        <Table
            dataSource={dataSource}
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
