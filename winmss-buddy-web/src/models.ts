export interface SquadModel {
    squadNo: number;
    squadName: string;
    noInSquad: number;
}

export interface ScoreModel {
    position: number;
    stageNumber: string | number;
    firstName: string;
    lastName: string;
    division: string | number;
    category: string | number;
    percentage: string;
    time: string | number;
    stagePoints: string | number;
    hitFactor: string;
    alpha: number;
    beta: number;
    charlie: number;
    delta: number;
    mike: number;
    penalty: number;
}

export interface CompetitorModel {
    firstName: string;
    lastName: string;
    division: number;
    category: number;
    region: number;
    class: number;
    squadName: string;
}

export interface StageModel {
    key: number;
    stageNumber: number;
    stageName: string;
    scoreCount: number;
}

