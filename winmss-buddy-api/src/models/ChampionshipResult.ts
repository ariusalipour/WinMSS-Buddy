import {MatchResult} from "./MatchResult";

export interface ChampionshipResult {
	memberId: number;
	firstname: string;
	lastname: string;
	regionId: string | undefined;
	divisionId: number | undefined;
	categoryId: number | undefined;
	totalScoreA: number;
	totalScoreB: number;
	totalScoreC: number;
	totalScoreD: number;
	totalMisses: number;
	totalPenalties: number;
	totalShootTime: number;
	totalFinalScore: number;
	matchResults: MatchResult[]
}
