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
	proceduralErrors: number;
	shootTime: number;
	hitFactor: number;
	finalScore: number;
}
