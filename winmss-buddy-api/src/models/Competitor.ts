export interface Competitor {
	memberId: number;
	lastname: string;
	firstname: string;
	regionId: string;
	classId: string;
	inactive?: boolean;
	female?: boolean;
	register?: boolean;
}
