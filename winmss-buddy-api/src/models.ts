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

