import { handleProcessRawData } from "./processRawData";
import { handleMergeCompetitorsData } from "./mergeCompetitorsData";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			return handleProcessRawData(request);
		}

		if (request.method === "POST" && url.pathname === "/process/merge-competitors-data") {
			return handleMergeCompetitorsData(request);
		}

		return new Response("Not Found", { status: 404 });
	},
};
