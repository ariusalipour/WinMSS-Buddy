export interface Match {
	matchName: string;
	stages: Stage[];
}

export interface Stage {
	stageId: string;
	stageName: string;
	maxPoints: string;
	competitorResults: CompetitorResult[];
}

export interface CompetitorResult {
	competitor: Competitor;
	result: Result;
}

export interface Competitor {
	competitorId: string;
	competitorName: string;
}

export interface Result {
	points: string;
	time: string;
	hits: {
		alpha: number;
		charlie: number;
		delta: number;
		mike: number;
		noShoots: number;
	};
}
