FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Copy shared-core library first
# Path is relative to the build context (monorepo root)
COPY libs/shared-core /app/libs/shared-core

# Install dependencies
# Path is relative to the build context (monorepo root)
COPY services/platform-core/requirements.txt .
RUN pip install --no-cache-dir -e /app/libs/shared-core && \
    pip install --no-cache-dir -r requirements.txt

# Copy platform-core project
# Path is relative to the build context (monorepo root)
COPY services/platform-core /app/services/platform-core

# Run the application (adjust path if main.py is not directly in services/platform-core)
# Assuming main.py is in services/platform-core/app/
WORKDIR /app/services/platform-core
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
