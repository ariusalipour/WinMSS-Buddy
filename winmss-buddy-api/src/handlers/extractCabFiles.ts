import yauzl from "yauzl";

export async function extractCabFiles(buffer: Uint8Array): Promise<Map<string, string>> {
	return new Promise((resolve, reject) => {
		const fileContents = new Map<string, string>();

		yauzl.fromBuffer(<Buffer<ArrayBufferLike>>buffer, { lazyEntries: true }, (err, zipfile) => {
			if (err || !zipfile) return reject(err);

			zipfile.on("entry", (entry) => {
				if (/\.xml$/i.test(entry.fileName)) {
					zipfile.openReadStream(entry, (streamErr, readStream) => {
						if (streamErr || !readStream) return reject(streamErr);

						let data = "";
						readStream.on("data", (chunk) => (data += chunk.toString()));
						readStream.on("end", () => {
							fileContents.set(entry.fileName, data);
							zipfile.readEntry();
						});
					});
				} else {
					zipfile.readEntry();
				}
			});

			zipfile.on("end", () => resolve(fileContents));
			zipfile.readEntry();
		});
	});
}
