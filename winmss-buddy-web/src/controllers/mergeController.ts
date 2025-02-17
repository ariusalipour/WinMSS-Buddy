// src/controllers/mergeController.ts
import { MatchesResults } from "../../../winmss-buddy-api/src/models/MatchesResults";
import { CompetitorMerge } from "../../../winmss-buddy-api/src/models/CompetitorMerge";
import { Competitor } from "../../../winmss-buddy-api/src/models/Competitor";
import { processMergeCompetitorsData } from "../services/api.ts";

export class MergeController {
    private matchesResults: MatchesResults;

    constructor(matchesResults: MatchesResults) {
        this.matchesResults = matchesResults;
    }

    getCompetitorMerges(): CompetitorMerge[] {
        return this.matchesResults.competitorMerges;
    }

    getCompetitors(): Competitor[] {
        return this.matchesResults.competitors;
    }

    updateCompetitorMerge(memberId: number, mergeMemberIds: number[]): void {
        const merge = this.matchesResults.competitorMerges.find(m => m.memberId === memberId);
        if (merge) {
            merge.mergeMemberIds = mergeMemberIds;
        } else {
            this.matchesResults.competitorMerges.push({ memberId, mergeMemberIds });
        }
    }

    async processMerges(): Promise<void> {
        await processMergeCompetitorsData(this.matchesResults);
    }

    clearAllMerges(): void {
        this.matchesResults.competitorMerges = [];
    }

    getMatchesResults(): MatchesResults {
        return this.matchesResults;
    }
}