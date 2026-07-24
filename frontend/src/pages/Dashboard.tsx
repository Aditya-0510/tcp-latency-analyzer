import { useState } from "react";

import FileUpload from "../components/FileUpload";
import SummaryCards from "../components/SummaryCards";
import PacketTable from "../components/PacketTable";

import { AnalysisReport, Packet } from "../types/report";
import PacketDetails from "../components/PacketDetails";

export default function Dashboard() {

    const [report, setReport] = useState<AnalysisReport | null>(null);
    const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);

    return (
        <div className="mx-auto max-w-7xl p-8">

            <h1 className="mb-8 text-4xl font-bold">
                TCP ACK Latency Analyzer
            </h1>

            <FileUpload
                onAnalysisComplete={setReport}
            />

            {report && (
                <>
                    <SummaryCards
                        summary={report.summary}
                    />

                   <div className="mt-8 grid grid-cols-12 gap-6">

                    <div className="col-span-8">

                        <PacketTable
                            packets={report.packets}
                            onSelectPacket={setSelectedPacket}
                        />

                    </div>

                    <div className="col-span-4">

                        <PacketDetails
                            packet={selectedPacket}
                        />

                    </div>

                </div>
                </>
            )}

        </div>
    );
}