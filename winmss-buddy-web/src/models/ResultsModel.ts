export interface ResultsModel {
    memberId: number;
    firstName: string;
    lastName: string;
    division: string;
    category: string;
    position: number;
    percentage: string;
    percentageScore: string;
    matchResults: MatchResult[];
}

export interface MatchResult {
    matchName: string;
    percentage: string;
}