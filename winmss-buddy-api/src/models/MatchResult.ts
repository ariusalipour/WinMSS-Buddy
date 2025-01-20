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
