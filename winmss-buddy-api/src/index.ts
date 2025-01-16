import { extractCabFiles } from "./handlers/extractCabFiles";
import { parseXmlFiles } from "./handlers/parseXml";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Route the request
		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			try {
				const contentType = request.headers.get("content-type") || "";
				if (!contentType.includes("multipart/form-data")) {
					return new Response("Invalid content type. Must be multipart/form-data", { status: 400 });
				}

				const formData = await request.formData();
				const file = formData.get("file") as File;
				if (!file) {
					return new Response("File is required", { status: 400 });
				}

				const arrayBuffer = await file.arrayBuffer();
				const cabBuffer = new Uint8Array(arrayBuffer);

				// Extract and parse XML files
				const extractedFiles = await extractCabFiles(cabBuffer);
				const parsedData = parseXmlFiles(extractedFiles);

				return new Response(JSON.stringify(parsedData, null, 2), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (err: any) {
				return new Response(`Error processing .cab file: ${err.message}`, { status: 500 });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
};
