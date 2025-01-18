import { ProcessedData, ChampionshipResultsResponse, ChampionshipResult, MatchResult, Score } from "./models";

export async function handleCreateChampionshipResults(request: Request): Promise<Response> {
	try {
		const requestData: ProcessedData = await request.json();

		const championshipResults = calculateChampionshipResults(requestData);

		const response: ChampionshipResultsResponse = {
			metadata: {
				totalCompetitors: championshipResults.length,
				totalMatches: requestData.matches.length,
			},
			results: championshipResults,
		};

		return new Response(JSON.stringify(response, null, 2), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		return new Response(`Error processing championship results: ${err.message}`, { status: 500 });
	}
}

function calculateChampionshipResults(data: ProcessedData): ChampionshipResult[] {
	const { scores, competitors, matches, registrations } = data;

	const validScores = scores.filter((score) => {
		if (!score.memberId) {
			console.warn(`Invalid score entry with null memberId:`, score);
			return false;
		}
		return true;
	});

	const groupedScores: Record<number, Record<number, Score[]>> = {};

	validScores.forEach((score) => {
		if (!groupedScores[score.memberId]) {
			groupedScores[score.memberId] = {};
		}
		if (!groupedScores[score.memberId][score.matchId]) {
			groupedScores[score.memberId][score.matchId] = [];
		}
		groupedScores[score.memberId][score.matchId].push(score);
	});

	const championshipResults: ChampionshipResult[] = Object.entries(groupedScores).map(
		([memberIdStr, matchScores]) => {
			const memberId = parseInt(memberIdStr, 10);
			const competitor = competitors.find((c) => c.memberId === memberId);

			let totalScoreA = 0;
			let totalScoreB = 0;
			let totalScoreC = 0;
			let totalScoreD = 0;
			let totalMisses = 0;
			let totalPenalties = 0;
			let totalShootTime = 0;
			let totalFinalScore = 0;

			const divisionId = registrations.find((r) => r.memberId === memberId)?.divisionId || undefined;
			const categoryId = registrations.find((r) => r.memberId === memberId)?.categoryId || undefined;

			const matchResults: MatchResult[] = Object.entries(matchScores).reduce(
				(acc, [matchIdStr, scores]) => {
					const matchId = parseInt(matchIdStr, 10);
					const match = matches.find((m) => m.matchId === matchId);

					const registration = registrations.find(
						(r) => r.matchId === matchId && r.memberId === memberId
					);

					const isDisqualified = registration?.isDisqualified || false;
					const disqualificationReason = isDisqualified ? registration?.disqualificationReason : undefined;
					const disqualificationDate = isDisqualified ? registration?.disqualificationDate : undefined;
					const disqualificationMemo = isDisqualified ? registration?.disqualificationMemo : undefined;

					if (isDisqualified) {
						acc.push({
							matchId,
							matchName: match?.matchName || "Unknown Match",
							scoreA: 0,
							scoreB: 0,
							scoreC: 0,
							scoreD: 0,
							misses: 0,
							penalties: 0,
							shootTime: 0,
							finalScore: 0,
							isDisqualified,
							disqualificationReason,
							disqualificationDate,
							disqualificationMemo,
						});
						return acc;
					}

					const matchScoreA = scores.reduce((sum, s) => sum + s.scoreA, 0);
					const matchScoreB = scores.reduce((sum, s) => sum + s.scoreB, 0);
					const matchScoreC = scores.reduce((sum, s) => sum + s.scoreC, 0);
					const matchScoreD = scores.reduce((sum, s) => sum + s.scoreD, 0);
					const matchMisses = scores.reduce((sum, s) => sum + s.misses, 0);
					const matchPenalties = scores.reduce((sum, s) => sum + s.penalties, 0);
					const matchShootTime = scores.reduce((sum, s) => sum + s.shootTime, 0);
					const matchFinalScore = scores.reduce((sum, s) => sum + s.finalScore, 0);

					totalScoreA += matchScoreA;
					totalScoreB += matchScoreB;
					totalScoreC += matchScoreC;
					totalScoreD += matchScoreD;
					totalMisses += matchMisses;
					totalPenalties += matchPenalties;
					totalShootTime += matchShootTime;
					totalFinalScore += matchFinalScore;

					acc.push({
						matchId,
						matchName: match?.matchName || "Unknown Match",
						scoreA: matchScoreA,
						scoreB: matchScoreB,
						scoreC: matchScoreC,
						scoreD: matchScoreD,
						misses: matchMisses,
						penalties: matchPenalties,
						shootTime: matchShootTime,
						finalScore: matchFinalScore,
						isDisqualified: false,
					});

					return acc;
				},
				[] as MatchResult[]
			);

			return {
				memberId,
				firstname: competitor?.firstname || "Unknown",
				lastname: competitor?.lastname || "Unknown",
				regionId: competitor?.regionId || undefined,
				divisionId, // New property
				categoryId, // New property
				totalScoreA,
				totalScoreB,
				totalScoreC,
				totalScoreD,
				totalMisses,
				totalPenalties,
				totalShootTime,
				totalFinalScore,
				matchResults,
			};
		}
	);

	return championshipResults;
}
