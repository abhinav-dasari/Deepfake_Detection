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

# 7. Expose port 8000
EXPOSE 8000

# 8. Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
