import axios from "axios";
import { AnalyzeResponse } from "../types/report";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

export async function analyzeCapture(
    file: File
): Promise<AnalyzeResponse> {

    const formData = new FormData();

    formData.append("pcap", file);

    const response =
        await api.post<AnalyzeResponse>(
            "/analyze",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    return response.data;
}