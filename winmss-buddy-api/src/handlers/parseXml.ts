import { XMLParser } from "fast-xml-parser";

export function parseXmlFiles(extractedFiles: Map<string, string>): Record<string, any> {
	const parser = new XMLParser();
	const parsedData: Record<string, any> = {};

	for (const [fileName, xmlContent] of extractedFiles) {
		parsedData[fileName] = parser.parse(xmlContent);
	}

	return parsedData;
}
