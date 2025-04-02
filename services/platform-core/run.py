#!/usr/bin/env python
"""
Run script for the Platform Core service.
This script provides a convenient way to start the service with various options.
"""
import argparse
import os
import sys

import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def main():
    """
    Main entry point for the run script.
    """
    parser = argparse.ArgumentParser(description="Run the Platform Core service")
    parser.add_argument(
        "--host",
        type=str,
        default=os.getenv("HOST", "0.0.0.0"),
        help="Host to bind the server to",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("PORT", "8000")),
        help="Port to bind the server to",
    )
    parser.add_argument(
        "--reload",
        action="store_true",
        default=os.getenv("RELOAD", "False").lower() == "true",
        help="Enable auto-reload on code changes",
    )
    parser.add_argument(
        "--env",
        type=str,
        choices=["development", "testing", "production"],
        default=os.getenv("ENV", "development"),
        help="Environment to run in",
    )

    args = parser.parse_args()

    # Set environment variable
    os.environ["ENV"] = args.env

    print(f"Starting Platform Core in {args.env} mode...")
    print(f"Server will be available at http://{args.host}:{args.port}")
    print("Press Ctrl+C to stop")

    # Run the server
    uvicorn.run(
        "app.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_level="info",
    )


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nShutting down...")
        sys.exit(0)
