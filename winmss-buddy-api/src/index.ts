import { Competitor, Match, Registration, Squad, Score } from "./models";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			try {
				const contentType = request.headers.get("Content-Type") || "";
				if (!contentType.includes("multipart/form-data")) {
					return new Response(
						JSON.stringify({ message: "Invalid content type. Use multipart/form-data." }),
						{ status: 400, headers: { "Content-Type": "application/json" } }
					);
				}

				// Parse form data for multiple files
				const formData = await request.formData();
				const files = Array.from(formData.entries())
					.filter(([key, value]) => value instanceof File)
					.map(([key, value]) => value as File);

				if (files.length === 0) {
					return new Response(
						JSON.stringify({ message: "No files uploaded." }),
						{ status: 400, headers: { "Content-Type": "application/json" } }
					);
				}

				let matchIdCounter = 1;
				let memberIdCounter = 1;
				let registrationIdCounter = 1;
				let squadIdCounter = 1;
				let scoreIdCounter = 1;
				let stageIdCounter = 1;
				const combinedData = {
					competitors: [] as Competitor[],
					matches: [] as Match[],
					registrations: [] as Registration[],
					squads: [] as Squad[],
					scores: [] as Score[],
				};

				for (const file of files) {
					const arrayBuffer = await file.arrayBuffer();
					let fileContent = new TextDecoder("utf-8").decode(arrayBuffer);

					// Track and update IDs with logging for debugging
					const matchIdMap: Record<string, string> = {};
					const memberIdMap: Record<string, string> = {};
					const registrationIdMap: Record<string, string> = {};
					const squadIdMap: Record<string, string> = {};
					const scoreIdMap: Record<string, string> = {};
					const stageIdMap: Record<string, string> = {};

					fileContent = fileContent.replace(/MatchId='(\d+)'/g, (match, originalId) => {
						if (!matchIdMap[originalId]) {
							matchIdMap[originalId] = String(matchIdCounter++);
						}
						console.log(`MatchId '${originalId}' updated to '${matchIdMap[originalId]}'`);
						return `MatchId='${matchIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/MemberId='(\d+)'/g, (match, originalId) => {
						if (!memberIdMap[originalId]) {
							memberIdMap[originalId] = String(memberIdCounter++);
						}
						console.log(`MemberId '${originalId}' updated to '${memberIdMap[originalId]}'`);
						return `MemberId='${memberIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/CompId='(\d+)'/g, (match, originalId) => {
						if (!registrationIdMap[originalId]) {
							registrationIdMap[originalId] = String(registrationIdCounter++);
						}
						console.log(`CompId '${originalId}' updated to '${registrationIdMap[originalId]}'`);
						return `CompId='${registrationIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/SquadId='(\d+)'/g, (match, originalId) => {
						if (!squadIdMap[originalId]) {
							squadIdMap[originalId] = String(squadIdCounter++);
						}
						console.log(`SquadId '${originalId}' updated to '${squadIdMap[originalId]}'`);
						return `SquadId='${squadIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/ScoreId='(\d+)'/g, (match, originalId) => {
						if (!scoreIdMap[originalId]) {
							scoreIdMap[originalId] = String(scoreIdCounter++);
						}
						console.log(`ScoreId '${originalId}' updated to '${scoreIdMap[originalId]}'`);
						return `ScoreId='${scoreIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/StageId='(\d+)'/g, (match, originalId) => {
						if (!stageIdMap[originalId]) {
							stageIdMap[originalId] = String(stageIdCounter++);
						}
						console.log(`StageId '${originalId}' updated to '${stageIdMap[originalId]}'`);
						return `StageId='${stageIdMap[originalId]}'`;
					});

					// Process file content individually
					const parsedData = processFile(fileContent);

					// Update IDs in related objects
					parsedData.registrations = parsedData.registrations.map((registration) => ({
						...registration,
						memberId: memberIdMap[registration.memberId] || registration.memberId,
						competitorId: registrationIdMap[registration.competitorId] || registration.competitorId,
					}));

					parsedData.squads = parsedData.squads.map((squad) => ({
						...squad,
						squadId: squadIdMap[squad.squadId] || squad.squadId,
					}));

					parsedData.scores = parsedData.scores.map((score) => ({
						...score,
						memberId: memberIdMap[score.memberId] || score.memberId,
						stageId: stageIdMap[score.stageId] || score.stageId,
					}));

					// Combine parsed data into the aggregated dataset
					combinedData.competitors.push(...parsedData.competitors);
					combinedData.matches.push(...parsedData.matches);
					combinedData.registrations.push(...parsedData.registrations);
					combinedData.squads.push(...parsedData.squads);
					combinedData.scores.push(...parsedData.scores);
				}

				// Return combined data
				return new Response(JSON.stringify(combinedData, null, 2), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (err: any) {
				return new Response(`Error processing files: ${err.message}`, {
					status: 500,
				});
			}
		}

		return new Response("Not Found", { status: 404 });
	},
};

// Helper function to process raw individual file content
function processFile(rawContent: string) {
	const rowRegex = /<z:row\s+([^>]+)\s*\/>/g;
	const attributeRegex = /(\w+)='([^']*)'/g;

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

	// Process the raw content into models
	const competitors = parseRows(rawContent, (attributes) =>
		"MemberId" in attributes && "Firstname" in attributes && "Lastname" in attributes
	).map((attributes) => ({
		memberId: attributes.MemberId,
		lastname: attributes.Lastname,
		firstname: attributes.Firstname,
		regionId: attributes.RegionId,
		classId: attributes.ClassId,
		inactive: attributes.InActive === "True",
		female: attributes.Female === "True",
		register: attributes.Register === "True",
	}));

	const matches = parseRows(rawContent, (attributes) =>
		"MatchId" in attributes && "MatchName" in attributes
	).map((attributes) => ({
		matchId: attributes.MatchId,
		matchName: attributes.MatchName,
		matchDate: attributes.MatchDt,
		matchLevel: attributes.MatchLevel,
		countryId: attributes.CountryId,
		squadCount: parseInt(attributes.SquadCount, 10),
	}));

	const registrations = parseRows(rawContent, (attributes) =>
		"CompId" in attributes && "DivId" in attributes
	).map((attributes) => ({
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

	const squads = parseRows(rawContent, (attributes) =>
		"SquadId" in attributes && "Squad" in attributes
	).map((attributes) => ({
		matchId: attributes.MatchId,
		squadId: attributes.SquadId,
		squadName: attributes.Squad,
	}));

	const scores = parseRows(rawContent, (attributes) =>
		"StageId" in attributes && "ScoreA" in attributes
	).map((attributes) => ({
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

	return { competitors, matches, registrations, squads, scores };
}
