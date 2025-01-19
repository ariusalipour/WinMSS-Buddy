import axios from "axios";

const API_BASE_URL = "https://winmss-buddy-api.chambercheck.app"; // Update to your API base URL

export const uploadRawData = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    console.log(formData);

    const response = await axios.post(`${API_BASE_URL}/process/raw-data`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data; // Ensure the API returns an array of matches
};
