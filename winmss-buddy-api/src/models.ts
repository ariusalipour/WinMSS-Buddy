export interface Competitor {
	memberId: string;
	lastname: string;
	firstname: string;
	regionId?: string;
	classId?: string;
	inactive?: boolean;
	female?: boolean;
	register?: boolean;
}

export interface Match {
	matchId: string;
	matchName: string;
	matchDate: string;
	matchLevel: string;
	countryId: string;
	squadCount: number;
}

export interface Registration {
	matchId: string;
	memberId: string;
	competitorId: string;
	divisionId: string;
	categoryId: string;
	squadId: string;
	isDisqualified: boolean;
	disqualificationReason?: string;
	disqualificationDate?: string;
	disqualificationMemo?: string;
}

export interface Squad {
	matchId: string;
	squadId: string;
	squadName: string;
}

export interface Score {
	matchId: string;
	stageId: string;
	memberId: string;
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
	stageId: string; // Original stage ID relative to the match
	matchId: string; // ID of the match this stage belongs to
	stageName: string; // Name or description of the stage
	uniqueStageId: number;
}




