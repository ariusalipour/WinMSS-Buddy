import axios from "axios";
import {ProcessedData} from "../models.ts";
const API_BASE_URL = "https://winmss-buddy-api.chambercheck.app"; // Update to your API base URL

export const uploadRawData = async (file: File): Promise<ProcessedData> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/process/raw-data`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return await response.data; // Ensure the API returns an array of matches
};
