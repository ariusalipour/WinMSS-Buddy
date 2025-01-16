export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			try {
				const arrayBuffer = await request.arrayBuffer();
				const rawContent = new TextDecoder("utf-8").decode(arrayBuffer);

				// Locate the first <xml and strip everything before it
				const xmlStartIndex = rawContent.indexOf("<xml");
				if (xmlStartIndex === -1) {
					return new Response(
						JSON.stringify({ message: "No <xml tag found in the file." }),
						{ headers: { "Content-Type": "application/json" }, status: 400 }
					);
				}

				// Extract the raw XML content
				const xmlContent = rawContent.slice(xmlStartIndex);

				// Debug: Return the raw XML content
				return new Response(xmlContent, {
					headers: { "Content-Type": "text/plain" },
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
