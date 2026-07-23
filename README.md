cmake -G "MinGW Makefiles" -B build  
cmake --build build 
./build/tcp_latency.exe test/small.pcapng   