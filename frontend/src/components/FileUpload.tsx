import { useState } from "react";
import { UploadCloud } from "lucide-react";

import { analyzeCapture } from "../api/analyzerApi";
import { AnalysisReport } from "../types/report";

interface FileUploadProps {
    onAnalysisComplete: (report: AnalysisReport) => void;
}

export default function FileUpload({
    onAnalysisComplete,
}: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleAnalyze() {
        if (!selectedFile) return;

        try {
            setLoading(true);
            setError("");

            const response = await analyzeCapture(selectedFile);

            onAnalysisComplete(response.report);
        } catch {
            setError("Analysis failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow">

            <label
                className="
                    flex
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-lg
                    border-2
                    border-dashed
                    border-slate-300
                    p-12
                    transition
                    hover:border-blue-500
                "
            >
                <UploadCloud size={48} />

                <p className="mt-4 font-medium">
                    Click to choose a PCAP file
                </p>

                <p className="text-sm text-slate-500">
                    .pcap or .pcapng
                </p>

                <input
                    type="file"
                    accept=".pcap,.pcapng"
                    className="hidden"
                    onChange={(e) =>
                        setSelectedFile(
                            e.target.files?.[0] ?? null
                        )
                    }
                />
            </label>

            {selectedFile && (
                <p className="mt-4">
                    Selected: <b>{selectedFile.name}</b>
                </p>
            )}

            {error && (
                <p className="mt-4 text-red-500">
                    {error}
                </p>
            )}

            <button
                disabled={!selectedFile || loading}
                onClick={handleAnalyze}
                className="
                    mt-6
                    rounded-lg
                    bg-blue-600
                    px-6
                    py-3
                    font-semibold
                    text-white
                    disabled:cursor-not-allowed
                    disabled:bg-slate-400
                "
            >
                {loading ? "Analyzing..." : "Analyze"}
            </button>
        </div>
    );
}