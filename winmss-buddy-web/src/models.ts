export interface Competitor {
    memberId: number;
    firstname: string;
    lastname: string;
    regionId?: number;
    divisionId?: number;
    categoryId?: number;
}

export interface MatchResult {
    matchId: number;
    matchName: string;
    scoreA: number;
    scoreB: number;
    scoreC: number;
    scoreD: number;
    misses: number;
    penalties: number;
    shootTime: number;
    finalScore: number;
    isDisqualified: boolean;
    disqualificationReason?: string;
    disqualificationDate?: string;
    disqualificationMemo?: string;
}

export interface ChampionshipResult {
    memberId: number;
    firstname: string;
    lastname: string;
    regionId?: number;
    divisionId?: number;
    categoryId?: number;
    totalScoreA: number;
    totalScoreB: number;
    totalScoreC: number;
    totalScoreD: number;
    totalMisses: number;
    totalPenalties: number;
    totalShootTime: number;
    totalFinalScore: number;
    matchResults: MatchResult[];
}

export interface ChampionshipResultsResponse {
    metadata: {
        totalCompetitors: number;
        totalMatches: number;
    };
    results: ChampionshipResult[];
}
