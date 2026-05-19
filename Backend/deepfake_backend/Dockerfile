# 1. Use official Python slim image for smaller size
FROM python:3.14-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Install system dependencies needed for psycopg2 and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy requirements first (leverages Docker layer caching)
COPY requirements.txt .

# 5. Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the entire Django project into /app
COPY . .

# 7. Collect static files at build time
RUN python manage.py collectstatic --noinput 2>/dev/null || true

# 8. Expose port (Render uses PORT env var, default 10000)
EXPOSE 10000

# 9. Start with gunicorn for production
CMD gunicorn deepfake_backend.wsgi:application --bind 0.0.0.0:${PORT:-10000}
