from prometheus_client import Counter, Gauge, Histogram

REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "path", "status"],
)
REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency",
    ["method", "path", "status"],
)
REQUEST_ERRORS = Counter(
    "http_request_errors_total",
    "Total HTTP 5xx responses",
    ["method", "path", "status"],
)

JOB_DURATION = Histogram(
    "job_duration_seconds",
    "Background job duration",
    ["task", "status"],
)

INSTANCE_CPU = Gauge(
    "dotmac_instance_cpu_percent",
    "Instance CPU usage percent",
    ["instance_id", "org_code"],
)
INSTANCE_MEMORY = Gauge(
    "dotmac_instance_memory_mb",
    "Instance memory usage (MB)",
    ["instance_id", "org_code"],
)
INSTANCE_DB_SIZE = Gauge(
    "dotmac_instance_db_size_mb",
    "Instance database size (MB)",
    ["instance_id", "org_code"],
)
INSTANCE_CONNECTIONS = Gauge(
    "dotmac_instance_active_connections",
    "Instance active DB connections",
    ["instance_id", "org_code"],
)
INSTANCE_RESPONSE_MS = Gauge(
    "dotmac_instance_response_ms",
    "Instance health response latency (ms)",
    ["instance_id", "org_code"],
)
DEPLOYMENTS_TOTAL = Counter(
    "dotmac_deployments_total",
    "Total deployments for instance",
    ["instance_id", "status"],
)
BACKUP_LAST_SUCCESS = Gauge(
    "dotmac_backup_last_success_timestamp",
    "Last successful backup time (unix timestamp)",
    ["instance_id"],
)


def observe_job(task_name: str, status: str, duration: float) -> None:
    JOB_DURATION.labels(task=task_name, status=status).observe(duration)
