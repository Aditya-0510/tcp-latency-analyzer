import { useState } from "react";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";

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
    const [isDragOver, setIsDragOver] = useState(false);

    function handleFile(file: File | null) {
        setError("");
        setSelectedFile(file);
    }

    async function handleAnalyze() {
        if (!selectedFile) return;

        try {
            setLoading(true);
            setError("");

            const response = await analyzeCapture(selectedFile);

            onAnalysisComplete(response.report);
        } catch {
            setError("Analysis failed. Check the file and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <label
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center transition-colors ${
                    isDragOver
                        ? "border-cyan-500 bg-slate-950"
                        : "border-slate-700 hover:border-slate-600"
                }`}
            >
                <UploadCloud
                    size={32}
                    className={
                        isDragOver ? "text-cyan-400" : "text-slate-600"
                    }
                />

                <p className="mt-4 text-sm font-medium text-slate-200">
                    Click to choose, or drag in a PCAP file
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    .pcap or .pcapng
                </p>

                <input
                    type="file"
                    accept=".pcap,.pcapng"
                    className="hidden"
                    onChange={(e) =>
                        handleFile(e.target.files?.[0] ?? null)
                    }
                />
            </label>

            {selectedFile && (
                <div className="mt-4 flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-4 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <FileText
                            size={16}
                            className="shrink-0 text-cyan-400"
                        />
                        <span className="truncate font-mono text-sm text-slate-200">
                            {selectedFile.name}
                        </span>
                        <span className="shrink-0 font-mono text-xs text-slate-500">
                            {(selectedFile.size / 1024).toFixed(0)} KB
                        </span>
                    </div>

                    <button
                        onClick={() => handleFile(null)}
                        aria-label="Remove file"
                        className="shrink-0 text-slate-500 transition-colors hover:text-slate-300"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {error && (
                <p className="mt-4 text-sm text-red-400">{error}</p>
            )}

            <button
                disabled={!selectedFile || loading}
                onClick={handleAnalyze}
                className="mt-6 flex items-center gap-2 rounded-md bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
            >
                {loading && (
                    <Loader2 size={15} className="animate-spin" />
                )}
                {loading ? "Analyzing..." : "Analyze"}
            </button>
        </div>
    );
}