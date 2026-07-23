cmake_minimum_required(VERSION 3.20)

project(TcpLatencyAnalyzer LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_executable(
    tcp_latency
    src/main.cpp
    src/parser.cpp
    src/flow_manager.cpp
    src/statistics.cpp
)

target_include_directories(
    tcp_latency
    PRIVATE
    include
)

# ============================================================
# Windows (Npcap)
# ============================================================
if(WIN32)

    # >>> CHANGE THIS TO YOUR Npcap SDK LOCATION <<<
    set(NPCAP_SDK "C:/Users/saditya/Downloads/npcap-sdk-1.16")

    if(NOT EXISTS "${NPCAP_SDK}/Include/pcap.h")
        message(FATAL_ERROR
            "Npcap SDK not found!\n"
            "Please set NPCAP_SDK to the correct location.\n"
            "Current value: ${NPCAP_SDK}"
        )
    endif()

    target_include_directories(
        tcp_latency
        PRIVATE
        "${NPCAP_SDK}/Include"
    )

    target_link_directories(
        tcp_latency
        PRIVATE
        "${NPCAP_SDK}/Lib/x64"
    )

    target_link_libraries(
        tcp_latency
        PRIVATE
        wpcap
        Packet
        ws2_32
    )

# ============================================================
# Linux (libpcap)
# ============================================================
else()

    find_package(PkgConfig REQUIRED)
    pkg_check_modules(PCAP REQUIRED libpcap)

    target_include_directories(
        tcp_latency
        PRIVATE
        ${PCAP_INCLUDE_DIRS}
    )

    target_link_libraries(
        tcp_latency
        PRIVATE
        ${PCAP_LIBRARIES}
    )

endif()