import { Competitor, Match, Registration, Squad, Score, Stage } from "./models";

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
				let uniqueStageIdCounter = 1;
				const combinedData = {
					matches: [] as Match[],
					stages: [] as Stage[],
					competitors: [] as Competitor[],
					squads: [] as Squad[],
					registrations: [] as Registration[],
					scores: [] as Score[],
				};

				for (const file of files) {
					const arrayBuffer = await file.arrayBuffer();
					let fileContent = new TextDecoder("utf-8").decode(arrayBuffer);

					const matchIdMap: Record<string, string> = {};
					const memberIdMap: Record<string, string> = {};
					const registrationIdMap: Record<string, string> = {};
					const squadIdMap: Record<string, string> = {};
					const scoreIdMap: Record<string, string> = {};

					fileContent = fileContent.replace(/MatchId='(\d+)'/g, (_, originalId) => {
						if (!matchIdMap[originalId]) matchIdMap[originalId] = String(matchIdCounter++);
						return `MatchId='${matchIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/MemberId='(\d+)'/g, (_, originalId) => {
						if (!memberIdMap[originalId]) memberIdMap[originalId] = String(memberIdCounter++);
						return `MemberId='${memberIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/CompId='(\d+)'/g, (_, originalId) => {
						if (!registrationIdMap[originalId]) registrationIdMap[originalId] = String(registrationIdCounter++);
						return `CompId='${registrationIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/SquadId='(\d+)'/g, (_, originalId) => {
						if (!squadIdMap[originalId]) squadIdMap[originalId] = String(squadIdCounter++);
						return `SquadId='${squadIdMap[originalId]}'`;
					});

					fileContent = fileContent.replace(/ScoreId='(\d+)'/g, (_, originalId) => {
						if (!scoreIdMap[originalId]) scoreIdMap[originalId] = String(scoreIdCounter++);
						return `ScoreId='${scoreIdMap[originalId]}'`;
					});

					const parsedData = processFile(fileContent);

					parsedData.stages = parsedData.stages.map((stage) => ({
						...stage,
						matchId: matchIdMap[stage.matchId] || stage.matchId,
						uniqueStageId: uniqueStageIdCounter++,
					}));

					combinedData.competitors.push(...parsedData.competitors);
					combinedData.matches.push(...parsedData.matches);
					combinedData.registrations.push(...parsedData.registrations);
					combinedData.squads.push(...parsedData.squads);
					combinedData.scores.push(...parsedData.scores);
					combinedData.stages.push(...parsedData.stages);
				}

				mergeCompetitors(combinedData);

				return new Response(JSON.stringify(combinedData, null, 2), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (err: any) {
				return new Response(`Error processing files: ${err.message}`, { status: 500 });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
};

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

	const stages = parseRows(rawContent, (attributes) =>
		"StageId" in attributes && "MatchId" in attributes && "StageName" in attributes
	).map((attributes) => ({
		stageId: attributes.StageId,
		matchId: attributes.MatchId,
		stageName: attributes.StageName,
		uniqueStageId: 0, // Temporary placeholder, will be set later
	}));

	return { matches, stages, competitors, squads, registrations, scores };
}

function mergeCompetitors(combinedData: {
	competitors: Competitor[];
	matches: Match[];
	registrations: Registration[];
	squads: Squad[];
	scores: Score[];
	stages: Stage[];
}) {
	const nameMap: Record<string, string> = {};
	const mergedCompetitors: Competitor[] = [];

	for (const competitor of combinedData.competitors) {
		const fullName = `${competitor.firstname} ${competitor.lastname}`.trim();
		if (!nameMap[fullName]) {
			nameMap[fullName] = String(competitor.memberId);
			mergedCompetitors.push(competitor);
		} else {
			const existingMemberId = nameMap[fullName];

			combinedData.registrations.forEach((registration) => {
				if (registration.memberId === competitor.memberId) {
					registration.memberId = Number(existingMemberId);
				}
			});

			combinedData.scores.forEach((score) => {
				if (score.memberId === competitor.memberId) {
					score.memberId = Number(existingMemberId);
				}
			});
		}
	}

	combinedData.competitors = mergedCompetitors;
}
