# CodeGenix Universal Compiler - Multi-stage Docker build
FROM ubuntu:22.04 as base

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies and all language compilers
RUN apt-get update && apt-get install -y \
    # Basic system tools
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    # Python and pip
    python3 \
    python3-pip \
    python3-venv \
    # C/C++ compiler
    gcc \
    g++ \
    make \
    # Java Development Kit
    default-jdk \
    # Node.js (JavaScript)
    nodejs \
    npm \
    # Additional languages
    php \
    golang-go \
    rustc \
    ruby \
    # Database tools for SQL
    sqlite3 \
    # Clean up
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install TypeScript globally
RUN npm install -g typescript

# Verify installations
RUN python3 --version && \
    node --version && \
    npm --version && \
    javac -version && \
    java -version && \
    gcc --version && \
    g++ --version && \
    php --version && \
    go version && \
    rustc --version && \
    ruby --version && \
    tsc --version

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /tmp/codegenix

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app/src

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "app:app"]