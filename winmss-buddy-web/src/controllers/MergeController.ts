// src/controllers/MergeController.ts
import { MatchesResults } from "../../../winmss-buddy-api/src/models/MatchesResults";
import { CompetitorMerge } from "../../../winmss-buddy-api/src/models/CompetitorMerge";
import { Competitor } from "../../../winmss-buddy-api/src/models/Competitor";
import { processMergeCompetitorsData } from "../services/api.ts";

export class MergeController {
    private matchesResults: MatchesResults;
    private setApiResponse: (data: MatchesResults) => void;

    constructor(matchesResults: MatchesResults, setApiResponse: (data: MatchesResults) => void) {
        this.matchesResults = matchesResults;
        this.setApiResponse = setApiResponse;
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
        this.setApiResponse(this.matchesResults);
    }

    removeCompetitorMerge(memberId: number): void {
        this.matchesResults.competitorMerges = this.matchesResults.competitorMerges.filter(m => m.memberId !== memberId);
        this.setApiResponse(this.matchesResults);
    }

    async processMerges(): Promise<void> {
        const response = await processMergeCompetitorsData(this.matchesResults);
        this.setApiResponse(response);
    }

    clearAllMerges(): void {
        this.matchesResults.competitorMerges = [];
        this.setApiResponse(this.matchesResults);
    }

    getMatchesResults(): MatchesResults {
        return this.matchesResults;
    }
}