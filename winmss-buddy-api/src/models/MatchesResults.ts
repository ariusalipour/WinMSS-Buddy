import {Match} from "./Match";
import {Stage} from "./Stage";
import {Competitor} from "./Competitor";
import {Squad} from "./Squad";
import {Registration} from "./Registration";
import {Score} from "./Score";
import {CompetitorMerge} from "./CompetitorMerge";


export interface MatchesResults {
	matches: Match[];
	stages: Stage[];
	competitors: Competitor[];
	squads: Squad[];
	registrations: Registration[];
	scores: Score[];
	competitorMerges: CompetitorMerge[];
}
