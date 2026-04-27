FROM python:3.11-slim

WORKDIR /app

# Copy dependency file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# We rely on docker-compose volume mapping for hot-reloading the code,
# but we copy it here as a fallback/production base.
COPY . .

EXPOSE 8000

# Start Uvicorn with host 0.0.0.0 so it's accessible outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
