FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
# The ML trainer loads the shared role dataset from this absolute path.
COPY src/data/job_roles_dataset.json /src/data/job_roles_dataset.json

# Pre-train ML model at build time
RUN python -c "from ml.analyzer import train_model; train_model(); print('Model trained')"

EXPOSE 10000

# Render provides PORT at runtime (10000 by default). Keep 8000 as the local
# fallback so the same image can still be run with `docker run -p 8000:8000`.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2"]
