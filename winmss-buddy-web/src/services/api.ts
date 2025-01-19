import axios from "axios";
import { ProcessedData } from "../../../winmss-buddy-api/src/models.ts";

const API_BASE_URL = "https://winmss-buddy-api.chambercheck.app"; // Update to your API base URL

export const uploadRawData = async (formData: FormData): Promise<ProcessedData> => {
    const response = await axios.post(`${API_BASE_URL}/process/raw-data`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data; // Assuming the API returns `ProcessedData`
};
