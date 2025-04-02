#!/bin/bash
# Script to run tests with the correct environment variables

# Load environment variables from .env.test
set -a
source .env.test
set +a

# Run the tests
python -m pytest "$@"
