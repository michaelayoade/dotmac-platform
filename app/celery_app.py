from celery import Celery

from app.services.scheduler_config import build_beat_schedule, get_celery_config

celery_app = Celery("starter_template")
celery_app.conf.update(get_celery_config())
celery_app.conf.beat_schedule = build_beat_schedule()
celery_app.conf.beat_scheduler = "app.celery_scheduler.DbScheduler"
celery_app.autodiscover_tasks(
    [
        "app.tasks",
        "app.tasks.deploy",
        "app.tasks.health",
        "app.tasks.cleanup",
        "app.tasks.monitoring",
        "app.tasks.lifecycle",
        "app.tasks.webhooks",
    ]
)
