# 🧱 Dotmac Platform Core

A foundational FastAPI-based microservice that provides essential platform services for your applications:

- 🔧 **Configuration Management**
- 📜 **Structured Application Logging**
- 🧾 **Audit Logging for sensitive actions**
- 🕸️ **Webhook Dispatching**
- 📣 **Notification Triggering (internal)**
- 🧪 **Feature Flag Control**
- 🩺 **Health & Readiness Probes**

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL
- Redis

### Setup with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/platform-core.git
   cd platform-core
   ```

2. Create a `.env` file (or use the existing one):
   ```
   # Environment Configuration
   ENV=development

   # Server Settings
   HOST=0.0.0.0
   PORT=8000
   RELOAD=True

   # Database Settings
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/platform_core

   # Redis Settings
   REDIS_URL=redis://localhost:6379/0

   # Security
   SECRET_KEY=replace_with_secure_key_in_production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30

   # Logging
   LOG_LEVEL=INFO

   # Webhooks
   WEBHOOK_SECRET=replace_with_secure_key_in_production
   WEBHOOK_MAX_RETRIES=3
   ```

3. Start the services with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

6. Access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs)

### Manual Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up PostgreSQL and Redis:
   - Create a PostgreSQL database named `platform_core`
   - Ensure Redis is running

3. Update the `.env` file with your database and Redis connection details

4. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

## 📦 Modules

### Configuration Management

Store and retrieve configuration values with namespacing, versioning, and access control.

```bash
# Create a configuration scope
curl -X POST "http://localhost:8000/config/scopes" -H "Content-Type: application/json" -d '{"name": "auth", "description": "Authentication settings"}'

# Add a configuration item
curl -X POST "http://localhost:8000/config/auth" -H "Content-Type: application/json" -d '{"key": "session_timeout", "value": "3600", "description": "Session timeout in seconds"}'

# Get a configuration item
curl "http://localhost:8000/config/auth/session_timeout"
```

### Feature Flags

Toggle features on/off globally or for specific users/groups.

```bash
# Create a feature flag
curl -X POST "http://localhost:8000/feature-flags" -H "Content-Type: application/json" -d '{"key": "new_ui", "name": "New UI", "description": "Enable new user interface", "enabled": false}'

# Check if a feature is enabled for a user
curl -X POST "http://localhost:8000/feature-flags/new_ui/check" -H "Content-Type: application/json" -d '{"user_id": "user123", "groups": ["beta_testers"]}'
```

### Structured Logging

Store and retrieve structured application logs.

```bash
# Create a log entry
curl -X POST "http://localhost:8000/logs" -H "Content-Type: application/json" -d '{"level": "INFO", "message": "User logged in", "source": "auth_service", "context": {"user_id": "user123", "ip_address": "192.168.1.1"}}'

# Query logs
curl "http://localhost:8000/logs?level=INFO&source=auth_service&limit=10"

# Export logs to JSON
curl "http://localhost:8000/logs/export?start_time=2023-01-01T00:00:00&end_time=2023-01-31T23:59:59" > logs.json
```

### Webhooks

Register webhook endpoints and trigger webhooks for events.

```bash
# Register a webhook endpoint
curl -X POST "http://localhost:8000/webhooks/endpoints" -H "Content-Type: application/json" -d '{"url": "https://example.com/webhook", "description": "Example webhook", "secret": "webhook_secret"}'

# Create a webhook subscription
curl -X POST "http://localhost:8000/webhooks/subscriptions" -H "Content-Type: application/json" -d '{"endpoint_id": 1, "event_types": ["user.created", "user.updated"]}'

# Trigger a webhook
curl -X POST "http://localhost:8000/webhooks/trigger" -H "Content-Type: application/json" -d '{"event_type": "user.created", "payload": {"user_id": "user123", "email": "user@example.com"}}'
```

### Notifications

Create and manage user notifications.

```bash
# Create a notification
curl -X POST "http://localhost:8000/notifications" -H "Content-Type: application/json" -d '{"title": "Welcome", "message": "Welcome to our platform!", "notification_type": "SYSTEM", "priority": "NORMAL", "recipient_id": "user123", "recipient_type": "user"}'

# Get notifications for a user
curl "http://localhost:8000/notifications?recipient_id=user123"

# Mark a notification as read
curl -X POST "http://localhost:8000/notifications/1/read"

# Get unread count
curl "http://localhost:8000/notifications/count?recipient_id=user123"
```

### Audit Logging

Track sensitive actions for compliance and security.

```bash
# Create an audit log entry
curl -X POST "http://localhost:8000/audit" -H "Content-Type: application/json" -d '{"actor_id": "user123", "event_type": "user_login", "resource_type": "user", "resource_id": "user123", "action": "login"}'

# Query audit logs
curl "http://localhost:8000/audit?actor_id=user123&event_type=user_login"
```

### Health Checks

Monitor the health and readiness of your application.

```bash
# Check liveness
curl "http://localhost:8000/health/healthz"

# Check readiness
curl "http://localhost:8000/health/readyz"

# Get metrics
curl "http://localhost:8000/health/metrics"
```

## 🔒 Security

- JWT authentication (via API Gateway)
- Role-based access control
- Audit logging for sensitive actions
- HMAC signature verification for webhooks
- Optional mTLS for service-to-service communication

## 🧪 Testing

Run tests with pytest:

```bash
pytest
```

## 🛠️ Development

### Project Structure

```
platform-core/
├── app/
│   ├── main.py                 # Application entry point
│   ├── modules/                # Feature modules
│   │   ├── config/             # Configuration management
│   │   ├── logging/            # Structured logging
│   │   ├── audit/              # Audit logging
│   │   ├── webhooks/           # Webhook dispatching
│   │   ├── notifications/      # Notification triggering
│   │   ├── feature_flags/      # Feature flag control
│   │   └── health/             # Health checks
│   ├── db/                     # Database models and connections
│   ├── core/                   # Core functionality and settings
│   └── utils/                  # Utility functions
├── tests/                      # Test suite
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
├── .env                        # Environment variables
└── requirements.txt            # Python dependencies
```

## 🔄 Scheduled Tasks

The platform includes a scheduler for maintenance tasks:

```bash
# Run all maintenance tasks
python -m app.scheduler --task all

# Clean up expired notifications
python -m app.scheduler --task clean-notifications

# Retry failed webhook deliveries
python -m app.scheduler --task retry-webhooks

# Prune old logs (default: 30 days)
python -m app.scheduler --task prune-logs --log-retention-days 60
```

## 📄 License

[MIT](LICENSE)
