import { handleProcessRawData } from "./processRawData";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			return handleProcessRawData(request);
		}

		return new Response("Not Found", { status: 404 });
	},
};
