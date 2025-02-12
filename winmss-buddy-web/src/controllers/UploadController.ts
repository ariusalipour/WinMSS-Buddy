// src/controllers/UploadController.ts
import { uploadRawData } from "../services/api";
import { MatchesResults } from "../../../winmss-buddy-api/src/models/MatchesResults";

export class UploadController {
    // Callback that updates the AppContext with the processed data.
    private setApiResponse: (data: MatchesResults) => void;

    constructor(setApiResponse: (data: MatchesResults) => void) {
        this.setApiResponse = setApiResponse;
    }

    /**
     * Uploads an array of files using the API, updates the AppContext with the
     * returned processed data, and returns an array of match names.
     *
     * @param files Array of files to upload.
     * @returns A promise that resolves with an array of match name objects.
     */
    async uploadFiles(
        files: File[]
    ): Promise<{ matchId: number; matchName: string }[]> {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        // Call the API with the files.
        const response = await uploadRawData(formData);

        // Update the AppContext with the processed data.
        this.setApiResponse(response);

        // Return the match names extracted from the response.
        return this.getMatchNames(response);
    }

    /**
     * Extracts and returns an array of match name objects from the given processed data.
     *
     * @param data Processed data returned from the API.
     * @returns An array of objects containing matchId and matchName.
     */
    getMatchNames(
        data: MatchesResults
    ): { matchId: number; matchName: string }[] {
        return data.matches
            ? data.matches.map((match) => ({
                matchId: match.matchId,
                matchName: match.matchName,
            }))
            : [];
    }
}
