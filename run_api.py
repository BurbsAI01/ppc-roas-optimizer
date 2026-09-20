#!/usr/bin/env python3
"""Run the PPC ROAS Optimizer API server."""
import sys
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "src.api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
