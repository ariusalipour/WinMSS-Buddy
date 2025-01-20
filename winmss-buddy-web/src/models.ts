export interface AppInfoModel {
    developerName: string;
    emailAddress: string;
    appName: string;
    appVersion: string;
    appDescription: string;
    socialMediaLinks: {
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
}

export interface SquadModel {
    squadNo: number;
    squadName: string;
    noInSquad: number;
}

export interface ScoreModel {
    position: number;
    stageNumber: number;
    firstName: string;
    lastName: string;
    division: string;
    category: string;
    percentage: string;
    time: number;
    stagePoints: number;
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

