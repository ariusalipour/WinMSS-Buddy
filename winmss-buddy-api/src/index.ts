import { handleProcessRawData } from "./processRawData";
import { handleMergeCompetitorsData } from "./mergeCompetitorsData";
import { handleCreateChampionshipResults } from "./createChampionshipResults";
import { handleRoot } from "./root";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "GET" && url.pathname === "/") {
			return handleRoot();
		}

		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			return handleProcessRawData(request);
		}

		if (request.method === "POST" && url.pathname === "/process/merge-competitors-data") {
			return handleMergeCompetitorsData(request);
		}

		if (request.method === "POST" && url.pathname === "/process/create-championship-results") {
			return handleCreateChampionshipResults(request);
		}

		return new Response("Not Found", { status: 404 });
	},
};
