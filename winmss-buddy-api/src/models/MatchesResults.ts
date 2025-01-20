import {Competitor, CompetitorMerge, Match, Registration, Score, Squad, Stage} from "../models";

export interface MatchesResults {
	matches: Match[];
	stages: Stage[];
	competitors: Competitor[];
	squads: Squad[];
	registrations: Registration[];
	scores: Score[];
	competitorMerges: CompetitorMerge[];
}
