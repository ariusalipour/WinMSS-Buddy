export interface Competitor {
	memberId: number;
	lastname: string;
	firstname: string;
	regionId?: string;
	classId?: string;
	inactive?: boolean;
	female?: boolean;
	register?: boolean;
}

export interface Match {
	matchId: number;
	matchName: string;
	matchDate: string;
	matchLevel: string;
	countryId: number;
	squadCount: number;
}

export interface Registration {
	matchId: number;
	memberId: number;
	competitorId: number;
	divisionId: number;
	categoryId: number;
	squadId: number;
	isDisqualified: boolean;
	disqualificationReason?: string;
	disqualificationDate?: string;
	disqualificationMemo?: string;
}

export interface Squad {
	matchId: number;
	squadId: number;
	squadName: string;
}

export interface Score {
	matchId: number;
	stageId: number;
	memberId: number;
	scoreA: number;
	scoreB: number;
	scoreC: number;
	scoreD: number;
	misses: number;
	penalties: number;
	shootTime: number;
	hitFactor: number;
	finalScore: number;
}

export interface Stage {
	stageId: number;
	matchId: number;
	stageName: string;
	uniqueStageId: number;
}

export interface CompetitorMerge {
	memberId: number; // The main member ID
	mergeMemberIds: number[]; // Array of member IDs to merge into the main member ID
}

export interface ProcessedData {
	matches: Match[];
	stages: Stage[];
	competitors: Competitor[];
	squads: Squad[];
	registrations: Registration[];
	scores: Score[];
	competitorMerges: CompetitorMerge[];
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
	divisionId?: number; // New property
	categoryId?: number; // New property
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
