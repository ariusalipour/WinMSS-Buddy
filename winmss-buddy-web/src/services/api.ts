import axios from "axios";
import { MatchesResults } from "../../../winmss-buddy-api/src/models/MatchesResults";

const API_BASE_URL = "https://winmss-buddy-api.mockachino.app"; // Update to your API base URL

export const uploadRawData = async (formData: FormData): Promise<MatchesResults> => {
    const response = await axios.post(`${API_BASE_URL}/process/raw-data`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data; // Assuming the API returns `ProcessedData`
};

export const processMergeCompetitorsData = async (matchesResults: MatchesResults): Promise<MatchesResults> => {
    const response = await axios.post(`${API_BASE_URL}/process/merge-competitors-data`, matchesResults, {
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};