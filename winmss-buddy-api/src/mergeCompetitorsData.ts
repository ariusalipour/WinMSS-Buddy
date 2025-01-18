import { ProcessedData, CompetitorMerge } from "./models";

export async function handleMergeCompetitorsData(request: Request): Promise<Response> {
	try {
		const requestData: ProcessedData = await request.json();

		// Create a map of all mergeMemberIds pointing to their associated memberId
		const mergeMap: Record<number, number> = {};
		requestData.competitorMerges.forEach((merge) => {
			merge.mergeMemberIds.forEach((mergeId) => {
				mergeMap[mergeId] = merge.memberId;
			});
		});

		// Replace references of mergeMemberIds in related objects
		const updatedRegistrations = requestData.registrations.map((registration) => ({
			...registration,
			memberId: mergeMap[registration.memberId] || registration.memberId,
		}));

		const updatedScores = requestData.scores.map((score) => ({
			...score,
			memberId: mergeMap[score.memberId] || score.memberId,
		}));

		// Remove mergeMemberIds from the competitors list
		const updatedCompetitors = requestData.competitors.filter(
			(competitor) => !mergeMap[competitor.memberId]
		);

		// Recalculate competitorMerges to reflect the updated state
		const updatedCompetitorMerges = recalculateCompetitorMerges(updatedCompetitors, mergeMap);

		// Construct the updated ProcessedData response
		const updatedData: ProcessedData = {
			matches: requestData.matches,
			stages: requestData.stages,
			competitors: updatedCompetitors,
			squads: requestData.squads,
			registrations: updatedRegistrations,
			scores: updatedScores,
			competitorMerges: updatedCompetitorMerges,
		};

		// Return the updated data
		return new Response(JSON.stringify(updatedData, null, 2), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		return new Response(`Error processing request: ${err.message}`, { status: 500 });
	}
}

function recalculateCompetitorMerges(
	competitors: ProcessedData["competitors"],
	mergeMap: Record<number, number>
): CompetitorMerge[] {
	const merges: CompetitorMerge[] = [];
	const groupedCompetitors: Record<number, number[]> = {};

	// Group competitors by the main memberId
	competitors.forEach((competitor) => {
		const mainMemberId = mergeMap[competitor.memberId] || competitor.memberId;
		if (!groupedCompetitors[mainMemberId]) {
			groupedCompetitors[mainMemberId] = [];
		}
		groupedCompetitors[mainMemberId].push(competitor.memberId);
	});

	// Create new CompetitorMerge objects
	Object.entries(groupedCompetitors).forEach(([mainId, memberIds]) => {
		const mainMemberId = parseInt(mainId, 10);
		const mergeMemberIds = memberIds.filter((id) => id !== mainMemberId);

		if (mergeMemberIds.length > 0) {
			merges.push({ memberId: mainMemberId, mergeMemberIds });
		}
	});

	return merges;
}
