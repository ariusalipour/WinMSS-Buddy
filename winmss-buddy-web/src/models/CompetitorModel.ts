// winmss-buddy-web/src/models/CompetitorModel.ts

export interface CompetitorModel {
    key: string; // Unique identifier for table rows
    firstName: string;
    lastName: string;
    division: number;
    category: number;
    region: string;
    class: string;
    squadName: string;
}
