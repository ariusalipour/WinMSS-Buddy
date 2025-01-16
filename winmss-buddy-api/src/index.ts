export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && url.pathname === "/process/raw-data") {
			try {
				// Read the binary content as text
				const arrayBuffer = await request.arrayBuffer();
				const rawContent = new TextDecoder("utf-8").decode(arrayBuffer);

				// Locate the first <xml and strip everything before it
				const xmlStartIndex = rawContent.indexOf("<xml");
				if (xmlStartIndex === -1) {
					return new Response(
						JSON.stringify(
							{
								message: "No <xml tag found in the file.",
								debug: rawContent.slice(0, 1000), // Include a snippet for debugging
							},
							null,
							2
						),
						{ headers: { "Content-Type": "application/json" }, status: 400 }
					);
				}

				// Retain only the XML content starting from <xml
				const xmlContent = rawContent.slice(xmlStartIndex);

				// Adjust regex to match <xml and </xml>
				const xmlPattern = /<xml[^>]*>[\s\S]*?<\/xml>/g;
				const extractedXml = xmlContent.match(xmlPattern);

				if (!extractedXml) {
					return new Response(
						JSON.stringify(
							{
								message: "No XML segments found in the cleaned content.",
								debug: xmlContent.slice(0, 1000), // Include content snippet for debugging
							},
							null,
							2
						),
						{ headers: { "Content-Type": "application/json" }, status: 400 }
					);
				}

				// Map extracted XML segments to a JSON response
				const parsedXml = extractedXml.map((xml, index) => ({
					file: `ExtractedXML_${index + 1}`,
					content: xml,
				}));

				return new Response(JSON.stringify(parsedXml, null, 2), {
					headers: { "Content-Type": "application/json" },
				});
			} catch (err: any) {
				return new Response(`Error processing the file: ${err.message}`, { status: 500 });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
};
