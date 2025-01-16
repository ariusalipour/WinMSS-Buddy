import { Competitor, Match, Registration, Squad, Score } from "./models";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			try {
				const arrayBuffer = await request.arrayBuffer();
				const rawContent = new TextDecoder("utf-8").decode(arrayBuffer);

				// Define regex for extracting <z:row> elements
				const rowRegex = /<z:row\s+([^>]+)\s*\/>/g;
				const attributeRegex = /(\w+)='([^']*)'/g;

				// Helper function to parse rows
				const parseRows = (content: string, filter?: (attributes: any) => boolean): any[] => {
					const rows: any[] = [];
					let match;

					while ((match = rowRegex.exec(content)) !== null) {
						const attributes = {};
						let attributeMatch;

						while ((attributeMatch = attributeRegex.exec(match[1])) !== null) {
							// @ts-ignore
							attributes[attributeMatch[1]] = attributeMatch[2];
						}

						if (!filter || filter(attributes)) {
							rows.push(attributes);
						}
					}

					return rows;
				};

				// Extract and map rows to models

				// Competitors
				const competitors: Competitor[] = parseRows(rawContent, (attributes) => "MemberId" in attributes && "Firstname" in attributes && "Lastname" in attributes).map((attributes) => ({
					memberId: attributes.MemberId,
					lastname: attributes.Lastname,
					firstname: attributes.Firstname,
					regionId: attributes.RegionId,
					classId: attributes.ClassId,
					inactive: attributes.InActive === "True",
					female: attributes.Female === "True",
					register: attributes.Register === "True",
				}));

				// Matches
				const matches: Match[] = parseRows(rawContent, (attributes) => "MatchId" in attributes && "MatchName" in attributes).map((attributes) => ({
					matchId: attributes.MatchId,
					matchName: attributes.MatchName,
					matchDate: attributes.MatchDt,
					matchLevel: attributes.MatchLevel,
					countryId: attributes.CountryId,
					squadCount: parseInt(attributes.SquadCount, 10),
				}));

				// Registrations
				const registrations: Registration[] = parseRows(rawContent, (attributes) => "CompId" in attributes && "DivId" in attributes).map((attributes) => ({
					matchId: attributes.MatchId,
					memberId: attributes.MemberId,
					competitorId: attributes.CompId,
					divisionId: attributes.DivId,
					categoryId: attributes.CatId,
					squadId: attributes.SquadId,
					isDisqualified: attributes.IsDisq === "True",
					disqualificationReason: attributes.DisqRuleId ? attributes.DisqRuleId : undefined,
					disqualificationDate: attributes.DisqDt ? attributes.DisqDt : undefined,
					disqualificationMemo: attributes.DisqMemo ? attributes.DisqMemo : undefined,
				}));

				// Squads
				const squads: Squad[] = parseRows(rawContent, (attributes) => "SquadId" in attributes && "Squad" in attributes).map((attributes) => ({
					matchId: attributes.MatchId,
					squadId: attributes.SquadId,
					squadName: attributes.Squad,
				}));

				// Scores
				const scores: Score[] = parseRows(rawContent, (attributes) => "StageId" in attributes && "ScoreA" in attributes).map((attributes) => ({
					matchId: attributes.MatchId,
					stageId: attributes.StageId,
					memberId: attributes.MemberId,
					scoreA: parseInt(attributes.ScoreA, 10),
					scoreB: parseInt(attributes.ScoreB, 10),
					scoreC: parseInt(attributes.ScoreC, 10),
					scoreD: parseInt(attributes.ScoreD, 10),
					misses: parseInt(attributes.Misses, 10),
					penalties: parseInt(attributes.Penalties, 10),
					shootTime: parseFloat(attributes.ShootTime),
					hitFactor: parseFloat(attributes.HitFactor),
					finalScore: parseInt(attributes.FinalScore, 10),
				}));

				// Combine extracted data into response
				const responseData = {
					competitors,
					matches,
					registrations,
					squads,
					scores,
				};

				return new Response(JSON.stringify(responseData, null, 2), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (err: any) {
				return new Response(`Error processing the file: ${err.message}`, {
					status: 500,
				});
			}
		}

		return new Response("Not Found", { status: 404 });
	},
};
