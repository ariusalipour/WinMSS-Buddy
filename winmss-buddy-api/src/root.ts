export async function handleRoot(): Promise<Response> {
	const apiSummary = {
		name: "WinMSS Buddy API",
		description: "API for managing and calculating championship results from WinMSS Data.",
		version: "1.0.0",
		endpoints: [
			{
				method: "POST",
				path: "/process/raw-data",
				description: "Processes raw match data to generate structured JSON.",
			},
			{
				method: "POST",
				path: "/process/merge-competitors-data",
				description: "Handles competitor merges by updating all related data.",
			},
			{
				method: "POST",
				path: "/process/create-championship-results",
				description: "Generates championship results by aggregating scores across matches.",
			},
		],
	};

	return new Response(JSON.stringify(apiSummary, null, 2), {
		headers: { "Content-Type": "application/json" },
	});
}
