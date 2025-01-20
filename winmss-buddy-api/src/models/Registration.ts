export interface Registration {
	matchId: number;
	memberId: number;
	competitorId: number;
	divisionId: number;
	categoryId: number;
	squadId: number;
	isDisqualified: boolean;
	disqualificationReason?: string;
	disqualificationDate?: string;
	disqualificationMemo?: string;
}
