import { handleProcessRawData } from "./processRawData";
import { handleMergeCompetitorsData } from "./mergeCompetitorsData";
import { handleCreateChampionshipResults } from "./createChampionshipResults";
import { handleRoot } from "./root";

const addCORSHeaders = (response: Response): Response => {
	const headers = new Headers(response.headers);
	headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins, or specify the allowed origin.
	headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	headers.set("Access-Control-Allow-Headers", "Content-Type");
	return new Response(response.body, {
		...response,
		headers,
	});
};

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Handle OPTIONS preflight request
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*", // Allow all origins
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		let response: Response;

		if (request.method === "GET" && url.pathname === "/") {
			response = await handleRoot();
		} else if (request.method === "POST" && url.pathname === "/process/raw-data") {
			response = await handleProcessRawData(request);
		} else if (request.method === "POST" && url.pathname === "/process/merge-competitors-data") {
			response = await handleMergeCompetitorsData(request);
		} else if (request.method === "POST" && url.pathname === "/process/create-championship-results") {
			response = await handleCreateChampionshipResults(request);
		} else {
			response = new Response("Not Found", { status: 404 });
		}

		// Add CORS headers to the response
		return addCORSHeaders(response);
	},
};
