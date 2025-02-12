import {Match} from "../../../winmss-buddy-api/src/models/Match.ts";
import {Competitor} from "../../../winmss-buddy-api/src/models/Competitor.ts";
import {Registration} from "../../../winmss-buddy-api/src/models/Registration.ts";
import {Squad} from "../../../winmss-buddy-api/src/models/Squad.ts";
import {Stage} from "../../../winmss-buddy-api/src/models/Stage.ts";
import {Score} from "../../../winmss-buddy-api/src/models/Score.ts";

export interface ApiResponse {
    matches: Match[];
    competitors: Competitor[];
    registrations: Registration[];
    squads: Squad[];
    stages: Stage[];
    scores: Score[];
}