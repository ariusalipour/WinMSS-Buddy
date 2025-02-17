import {Match} from "../models/Match";
import {Stage} from "../models/Stage";
import {Competitor} from "../models/Competitor";
import {Squad} from "../models/Squad";
import {Registration} from "../models/Registration";
import {Score} from "../models/Score";
import {CompetitorMerge} from "../models/CompetitorMerge";
import {MatchesResults} from "../models/MatchesResults";


export async function handleProcessRawData(request: Request): Promise<Response> {
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
			competitorMerges: [] as CompetitorMerge[],
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
				matchId: Number(matchIdMap[stage.matchId] || stage.matchId), // Ensure matchId is a number
				uniqueStageId: uniqueStageIdCounter++,
			}));


			combinedData.competitors.push(...parsedData.competitors);
			combinedData.matches.push(...parsedData.matches);
			combinedData.registrations.push(...parsedData.registrations);
			combinedData.squads.push(...parsedData.squads);
			combinedData.scores.push(...parsedData.scores);
			combinedData.stages.push(...parsedData.stages);
		}

		const competitorMerges = createCompetitorMerges(combinedData.competitors, combinedData.registrations);
		combinedData.competitorMerges = competitorMerges;

		const processedData: MatchesResults = {
			matches: combinedData.matches,
			stages: combinedData.stages,
			competitors: combinedData.competitors,
			squads: combinedData.squads,
			registrations: combinedData.registrations,
			scores: combinedData.scores,
			competitorMerges: combinedData.competitorMerges,
		};

		return new Response(JSON.stringify(processedData, null, 2), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		return new Response(`Error processing files: ${err.message}`, { status: 500 });
	}
}

function createCompetitorMerges(competitors: Competitor[], registrations: Registration[]): CompetitorMerge[] {
	const merges: CompetitorMerge[] = [];
	const groupedCompetitors: Record<string, Competitor[]> = {};

	// Group competitors by lastname and first initial
	competitors.forEach(competitor => {
		const key = `${competitor.lastname}-${competitor.firstname.charAt(0).toUpperCase()}`;
		if (!groupedCompetitors[key]) {
			groupedCompetitors[key] = [];
		}
		groupedCompetitors[key].push(competitor);
	});

	// Create merges within each group, excluding competitors from the same match
	Object.values(groupedCompetitors).forEach(group => {
		const matchGroups: Record<number, Competitor[]> = {};

		group.forEach(competitor => {
			const registration = registrations.find(r => r.memberId === competitor.memberId);
			if (registration) {
				const matchId = registration.matchId;
				if (!matchGroups[matchId]) {
					matchGroups[matchId] = [];
				}
				matchGroups[matchId].push(competitor);
			}
		});

		// Compare competitors across different matches
		const matchIds = Object.keys(matchGroups).map(Number);
		for (let i = 0; i < matchIds.length; i++) {
			for (let j = i + 1; j < matchIds.length; j++) {
				const group1 = matchGroups[matchIds[i]];
				const group2 = matchGroups[matchIds[j]];

				group1.forEach(main => {
					const mergeMemberIds = group2.map(competitor => competitor.memberId);
					if (mergeMemberIds.length > 0) {
						merges.push({
							memberId: main.memberId,
							mergeMemberIds: mergeMemberIds,
						});
					}
				});
			}
		}
	});

	return merges;
}

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
		memberId: parseInt(attributes.MemberId, 10),
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
		matchId: parseInt(attributes.MatchId, 10),
		matchName: attributes.MatchName,
		matchDate: attributes.MatchDt,
		matchLevel: attributes.MatchLevel,
		countryId: parseInt(attributes.CountryId, 10),
		squadCount: parseInt(attributes.SquadCount, 10),
	}));

	const registrations = parseRows(rawContent, (attributes) =>
		"CompId" in attributes && "DivId" in attributes
	).map((attributes) => ({
		matchId: parseInt(attributes.MatchId, 10),
		memberId: parseInt(attributes.MemberId, 10),
		competitorId: parseInt(attributes.CompId, 10),
		divisionId: parseInt(attributes.DivId, 10),
		categoryId: parseInt(attributes.CatId, 10),
		squadId: parseInt(attributes.SquadId, 10),
		MajorPF: attributes.MajorPF === "True",
		isDisqualified: attributes.IsDisq === "True",
		disqualificationReason: attributes.DisqRuleId || undefined,
		disqualificationDate: attributes.DisqDt || undefined,
		disqualificationMemo: attributes.DisqMemo || undefined,
	}));

	const squads = parseRows(rawContent, (attributes) =>
		"SquadId" in attributes && "Squad" in attributes
	).map((attributes) => ({
		matchId: parseInt(attributes.MatchId, 10),
		squadId: parseInt(attributes.SquadId, 10),
		squadName: attributes.Squad,
	}));

	const scores = parseRows(rawContent, (attributes) =>
		"StageId" in attributes && "ScoreA" in attributes
	).map((attributes) => ({
		matchId: parseInt(attributes.MatchId, 10),
		stageId: parseInt(attributes.StageId, 10),
		memberId: parseInt(attributes.MemberId, 10),
		scoreA: parseInt(attributes.ScoreA, 10),
		scoreB: parseInt(attributes.ScoreB, 10),
		scoreC: parseInt(attributes.ScoreC, 10),
		scoreD: parseInt(attributes.ScoreD, 10),
		misses: parseInt(attributes.Misses, 10),
		penalties: parseInt(attributes.Penalties, 10),
		proceduralErrors: parseInt(attributes.ProcError, 10),
		shootTime: parseFloat(attributes.ShootTime),
		hitFactor: parseFloat(attributes.HitFactor),
		finalScore: parseInt(attributes.FinalScore, 10),
	}));

	const stages = parseRows(rawContent, (attributes) =>
		"StageId" in attributes && "MatchId" in attributes && "StageName" in attributes
	).map((attributes) => ({
		stageId: parseInt(attributes.StageId, 10),
		matchId: parseInt(attributes.MatchId, 10),
		maxPoints: parseInt(attributes.MaxPoints, 10),
		stageName: attributes.StageName,
		uniqueStageId: 0, // Temporary placeholder, will be set later
	}));

	return { matches, stages, competitors, squads, registrations, scores };
}
