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
import {OverallScoreModel} from "../models/OverallScoreModel.ts";

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

    getCompetitorCount(matchId: number): number {
        return this.registrations.filter(reg => reg.matchId === matchId).length;
    }

    getStageCount(matchId: number): number {
        return this.stages.filter(stage => stage.matchId === matchId).length;
    }

    getSquadCount(matchId: number): number {
        return this.squads.filter(squad => squad.matchId === matchId).length;
    }

    getScoreCount(matchId: number): number {
        return this.scores.filter(score => score.matchId === matchId).length;
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
                    score => score.stageId === stage.stageId && score.matchId === matchId
                ).length;
                return { ...stage, noOfScores };
            });

        return filteredStages.map<StageModel>(s => ({
            stageNumber: s.stageId,
            stageName: s.stageName,
            maxPoints: s.maxPoints,
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
                return { ...score, registration, competitor };
            });

        // Calculate stage results
        const stage = this.stages.find(stage => stage.stageId === stageNo && stage.matchId === matchId);
        const maxPoints = stage ? stage.maxPoints : 0;

        const highestHitFactor =
            filteredScores.length > 0
                ? Math.max(...filteredScores.map(s => s.hitFactor || 0))
                : 0;

        const scoresWithPercentages = filteredScores.map(s => {
            const percentage =
                highestHitFactor > 0 ? ((s.hitFactor || 0) / highestHitFactor) * 100 : 0;
            const stagePoints = percentage > 0 ? (maxPoints * (percentage / 100)) : 0;
            return { ...s, percentage: percentage.toFixed(2), stagePoints };
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
            alpha: s.scoreA,
            beta: s.scoreB,
            charlie: s.scoreC,
            delta: s.scoreD,
            mike: s.misses,
            noShoot: s.penalties,
            stageNumber: s.stageId,
            hitFactor: s.hitFactor,
            stagePoints: s.stagePoints,
            class: s.competitor?.classId || "",
            powerFactor: s.registration?.MajorPF ? "Major" : "Minor",
            procedural: s.proceduralErrors,
            key: `${s.stageId}-${s.memberId}`,
        }));
    }

    getOverallScores(matchId: number, divisionId?: number, categoryId?: number): OverallScoreModel[] {
        const stageModels = this.getStages(matchId);
        const allScores = stageModels.flatMap(stage => this.getScores(matchId, stage.stageNumber, divisionId, categoryId));

        const overallScores = allScores.reduce((acc, score) => {
            const key = `${score.firstName}-${score.lastName}-${score.category}-${score.division}`;
            if (!acc[key]) {
                acc[key] = { ...score, totalPoints: 0, totalTime: 0, totalAlpha: 0, totalBeta: 0, totalCharlie: 0, totalDelta: 0, totalMike: 0, totalPenalty: 0, totalProcedural: 0, totalStagePoints: 0 };
            }
            acc[key].totalPoints += score.stagePoints;
            acc[key].totalTime += score.time;
            acc[key].totalAlpha += score.alpha;
            acc[key].totalBeta += score.beta;
            acc[key].totalCharlie += score.charlie;
            acc[key].totalDelta += score.delta;
            acc[key].totalMike += score.mike;
            acc[key].totalPenalty += score.noShoot;
            acc[key].totalProcedural += score.procedural;
            acc[key].totalStagePoints += score.stagePoints;
            return acc;
        }, {} as { [key: string]: ScoreModel & { totalPoints: number; totalTime: number; totalAlpha: number; totalBeta: number; totalCharlie: number; totalDelta: number; totalMike: number; totalPenalty: number; totalProcedural: number; totalStagePoints: number } });

        const sortedOverallScores = Object.values(overallScores).sort((a, b) => b.totalPoints - a.totalPoints);

        return sortedOverallScores.map((s, index) => ({
            position: index + 1,
            firstName: s.firstName,
            lastName: s.lastName,
            category: s.category,
            percentage: ((s.totalPoints / sortedOverallScores[0].totalPoints) * 100).toFixed(2),
            points: s.totalPoints,
            time: s.totalTime,
            division: s.division,
            class: s.class,
            powerFactor: s.powerFactor,
            alpha: s.totalAlpha,
            beta: s.totalBeta,
            charlie: s.totalCharlie,
            delta: s.totalDelta,
            mike: s.totalMike,
            noShoot: s.totalPenalty,
            procedural: s.totalProcedural,
            stagePoints: s.totalStagePoints,
            key: `${s.firstName}-${s.lastName}-${s.category}-${s.division}`
        }));
    }
}
