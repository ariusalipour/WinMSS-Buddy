// src/controllers/MatchesController.ts
import { Match } from "../../../winmss-buddy-api/src/models/Match";
import { Competitor } from "../../../winmss-buddy-api/src/models/Competitor";
import { Registration } from "../../../winmss-buddy-api/src/models/Registration";
import { Squad } from "../../../winmss-buddy-api/src/models/Squad";
import { Stage } from "../../../winmss-buddy-api/src/models/Stage";
import { Score } from "../../../winmss-buddy-api/src/models/Score";
import { MatchModel } from "../models/MatchModel";
import { CompetitorModel } from "../models/CompetitorModel";
import { StageModel } from "../models/StageModel";
import { SquadModel } from "../models/SquadModel";
import { ScoreModel } from "../models/ScoreModel";
import {ApiResponse} from "../models/ApiResponse.ts";

export class MatchesController {
    private matches: Match[];
    private competitors: Competitor[];
    private registrations: Registration[];
    private squads: Squad[];
    private stages: Stage[];
    private scores: Score[];

    constructor(apiResponse: ApiResponse) {
        this.matches = apiResponse.matches || [];
        this.competitors = apiResponse.competitors || [];
        this.registrations = apiResponse.registrations || [];
        this.squads = apiResponse.squads || [];
        this.stages = apiResponse.stages || [];
        this.scores = apiResponse.scores || [];
    }

    getMatches(): MatchModel[] {
        return this.matches.map<MatchModel>(m => ({
            matchId: m.matchId,
            matchName: m.matchName,
        }));
    }

    getCompetitors(matchId: number): CompetitorModel[] {
        const filteredRegistrations = this.registrations.filter(
            registration => registration.matchId === matchId
        );
        const filteredCompetitors = filteredRegistrations
            .map(reg => {
                const competitor = this.competitors.find(
                    comp => comp.memberId === reg.memberId
                );
                const squad = this.squads.find(s => s.squadId === reg.squadId);
                return competitor ? { ...competitor, registration: reg, squad } : undefined;
            })
            .filter(comp => comp !== undefined) as Array<
            Competitor & { registration: Registration; squad?: Squad }
        >;

        return filteredCompetitors.map<CompetitorModel>(c => ({
            competitorId: c.memberId,
            firstName: c.firstname,
            lastName: c.lastname,
            division: c.registration?.divisionId ?? 0,
            category: c.registration?.categoryId ?? 0,
            region: c.regionId,
            class: c.classId,
            squadName: c.squad?.squadName ?? "",
        }));
    }

    getStages(matchId: number): StageModel[] {
        const filteredStages = this.stages
            .filter(stage => stage.matchId === matchId)
            .map(stage => {
                const noOfScores = this.scores.filter(
                    score => score.stageId === stage.stageId
                ).length;
                return { ...stage, noOfScores };
            });

        return filteredStages.map<StageModel>(s => ({
            stageNumber: s.stageId,
            stageName: s.stageName,
            scoreCount: s.noOfScores,
        }));
    }

    getSquads(matchId: number): SquadModel[] {
        const filteredSquads = this.squads
            .filter(squad => squad.matchId === matchId)
            .map(squad => {
                const noInSquad = this.registrations.filter(
                    r => r.squadId === squad.squadId
                ).length;
                return { ...squad, noInSquad };
            });

        return filteredSquads.map<SquadModel>(s => ({
            squadNo: s.squadId,
            squadName: s.squadName,
            noInSquad: s.noInSquad,
        }));
    }

    getUniqueDivisions(matchId: number): number[] {
        return this.registrations
            .filter(reg => reg.matchId === matchId)
            .map(reg => reg.divisionId)
            .filter((value, index, self) => self.indexOf(value) === index);
    }

    getUniqueCategories(matchId: number): number[] {
        return this.registrations
            .filter(reg => reg.matchId === matchId)
            .map(reg => reg.categoryId)
            .filter((value, index, self) => self.indexOf(value) === index);
    }

    getScores(
        matchId: number,
        stageNo?: number,
        divisionId?: number,
        categoryId?: number
    ): ScoreModel[] {
        const filteredScores = this.scores
            .filter(score => score.matchId === matchId)
            .filter(score => (stageNo !== undefined ? score.stageId === stageNo : true))
            .filter(score => {
                const registration = this.registrations.find(r => r.memberId === score.memberId);
                return divisionId !== undefined
                    ? registration?.divisionId === divisionId
                    : true;
            })
            .filter(score => {
                const registration = this.registrations.find(r => r.memberId === score.memberId);
                return categoryId !== undefined
                    ? registration?.categoryId === categoryId
                    : true;
            })
            .map(score => {
                const registration = this.registrations.find(r => r.memberId === score.memberId);
                const competitor = this.competitors.find(
                    c => registration?.memberId === c.memberId
                );
                const stage = this.stages.find(s => score.stageId === s.stageId);
                return { ...score, registration, competitor, stage };
            });

        const highestHitFactor =
            filteredScores.length > 0
                ? Math.max(...filteredScores.map(s => s.hitFactor || 0))
                : 0;

        const scoresWithPercentages = filteredScores.map(s => {
            const percentage =
                highestHitFactor > 0 ? ((s.hitFactor || 0) / highestHitFactor) * 100 : 0;
            return { ...s, percentage: percentage.toFixed(2) };
        });

        scoresWithPercentages.sort(
            (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)
        );

        return scoresWithPercentages.map<ScoreModel>((s, index) => ({
            position: index + 1,
            firstName: s.competitor?.firstname || "",
            lastName: s.competitor?.lastname || "",
            category: s.registration?.categoryId?.toString() || "",
            percentage: s.percentage,
            points: s.finalScore,
            time: s.shootTime,
            division: s.registration?.divisionId?.toString() || "",
            hitFactor: s.hitFactor,
            alpha: s.scoreA,
            beta: s.scoreB,
            charlie: s.scoreC,
            delta: s.scoreD,
            mike: s.misses,
            penalty: s.penalties,
            stageNumber: s.stage?.stageId || 0,
            key: `${s.stageId}-${s.memberId}`,
        }));
    }
}
