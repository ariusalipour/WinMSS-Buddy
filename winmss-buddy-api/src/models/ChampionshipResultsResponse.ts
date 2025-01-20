import {ChampionshipResult} from "./ChampionshipResult";

export interface ChampionshipResultsResponse {
	metadata: {
		totalCompetitors: number;
		totalMatches: number;
	};
	results: ChampionshipResult[];
}
