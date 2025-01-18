export interface Competitor {
	memberId: number;
	lastname: string;
	firstname: string;
	regionId?: number;
	classId?: number;
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
