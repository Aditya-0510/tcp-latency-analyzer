# TCP ACK Latency Analyzer

A high-performance TCP packet analyzer built in **C++** that processes offline PCAP captures, identifies TCP flows, detects retransmissions and duplicate ACKs, computes ACK latency for transmitted data packets, and generates a structured JSON report. The analyzer is integrated with a full-stack web dashboard for visualization and supports direct packet navigation in Wireshark.

---

# Features

- Parse offline `.pcap` captures using **libpcap/Npcap**
- Identify and track individual TCP flows
- Match transmitted TCP data packets with their corresponding ACKs
- Compute ACK latency for every acknowledged data packet
- Detect retransmissions
- Detect duplicate ACKs
- Generate detailed JSON reports
- Interactive React dashboard
- Packet filtering and search
- Latency threshold filtering
- Status-based filtering
- One-click packet navigation in Wireshark

---

# Tech Stack

## Analyzer

- C++17
- libpcap / Npcap
- CMake
- nlohmann/json

## Backend

- Node.js
- Express.js

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Table
- Recharts
- Axios

---

# Project Architecture

```
                     +--------------------+
                     |   PCAP Capture     |
                     +---------+----------+
                               |
                               v
                    +----------------------+
                    |    Packet Parser     |
                    |  Ethernet/IP/TCP     |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    Flow Manager      |
                    |  TCP Flow Tracking   |
                    +----------+-----------+
                               |
        +----------------------+----------------------+
        |                                             |
        v                                             v
+---------------------+                  +------------------------+
| Retransmission      |                  | Duplicate ACK          |
| Detection           |                  | Detection              |
+---------------------+                  +------------------------+
                               |
                               v
                    +----------------------+
                    | ACK Matching Engine  |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Statistics Generator |
                    +----------+-----------+
                               |
                               v
                        analysis.json
                               |
                               v
                  +-------------------------+
                  | Express Backend API     |
                  +-----------+-------------+
                              |
                              v
                 +--------------------------+
                 | React Dashboard          |
                 | - Summary                |
                 | - Charts                 |
                 | - Packet Table           |
                 | - Packet Details         |
                 +-----------+--------------+
                             |
                             v
                        Wireshark
```

---

# Packet Processing Pipeline

```
PCAP File
    │
    ▼
Read Ethernet Frame
    │
    ▼
Parse IPv4 Header
    │
    ▼
Parse TCP Header
    │
    ▼
Determine Flow
    │
    ▼
Store Outstanding Data Segments
    │
    ▼
Receive ACK
    │
    ▼
Match ACK → Original Data Packet
    │
    ▼
Compute ACK Latency
    │
    ▼
Generate Report
```
---

# Prerequisites

## Windows

- CMake
- GCC (c/cpp compiler)
- Git
- Node.js (18+)
- Npcap SDK
- Wireshark

---

## Linux

- GCC / Clang
- CMake
- libpcap-dev
- Node.js 18+
- Wireshark

---

# Clone Repository

```bash
git clone https://github.com/<username>/tcp-latency-analyzer.git

cd tcp-latency-analyzer
```

---

# Building the Analyzer

## Windows

```bash
cd analyzer
cmake -G "MinGW Makefiles" -B build 
cmake --build build
```

Executable (in the build folder):

```
tcp_latency.exe
```

---

## Linux

```bash
cd analyzer
cmake -B build
cmake --build build
```
 Ensure `libpcap-dev` (or your distribution's equivalent) is installed before building.


---

# Running the Analyzer
(for testing)
```
tcp_latency <capture.pcap> <analysis.json>
```

Example:

Windows

```bash
tcp_latency.exe sample.pcap analysis.json
```

Linux

```bash
./tcp_latency sample.pcap analysis.json
```

---

# Backend Setup

Install dependencies

```bash
cd backend

npm install
```

Create `.env`

```env
WIRESHARK_PATH=C:\Program Files\Wireshark\Wireshark.exe
ANALYZER_PATH=../analyzer/build/tcp_latency.exe
```

Linux

```env
WIRESHARK_PATH=/usr/bin/wireshark
ANALYZER_PATH=../analyzer/build/tcp_latency
```

Run

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

# Frontend Setup

Install dependencies

```bash
cd frontend

npm install
```

Run

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

---


# JSON Report

The analyzer generates a JSON report containing:

- Packet metadata
- ACK latency
- Retransmission status
- Duplicate ACK status
- TCP flags
- Summary statistics

Example

```json
{
    "summary": {
        "totalTcpPackets": 1254,
        "matchedPackets": 1042,
        "averageLatency": 3.42
    },
    "packets": [
        {
            "packetNumber": 10,
            "matched": true,
            "latency": 2.35
        }
    ]
}
```

---

# Dashboard Features

- Upload PCAP
- Packet Summary
- ACK Latency Statistics
- Interactive Charts
- Search
- Sorting
- Pagination
- Latency Threshold Filter
- Status Filter
- Packet Details
- Open Packet in Wireshark

---

# Supported Packet Status

- Normal
- Matched
- Retransmission
- Duplicate ACK

---