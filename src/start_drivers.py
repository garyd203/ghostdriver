#!/usr/bin/env python

import subprocess

start_port = 8080
processes = []

for i in range(20):
    proc = subprocess.Popen(
        [
            "/home/garyd/devel/phantomjs-ghostdriver-branch/bin/phantomjs",
            "--proxy-type=none",
            "src/main.js",
            str(start_port + i),
            "http://localhost:4444/",
        ],
    )
    
    processes.append(proc)

try:
    for proc in processes:
        proc.wait()
except KeyboardInterrupt:
    for proc in processes:
        proc.terminate()
