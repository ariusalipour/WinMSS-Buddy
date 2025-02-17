export interface Registration {
	matchId: number;
	memberId: number;
	competitorId: number;
	divisionId: number;
	categoryId: number;
	squadId: number;
	MajorPF: boolean;
	isDisqualified: boolean;
	disqualificationReason?: string;
	disqualificationDate?: string;
	disqualificationMemo?: string;
}
