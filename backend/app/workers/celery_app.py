from celery import Celery

celery_app = Celery(
    "academiq_worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.task_track_started = True

celery_app.conf.imports = [
    "app.workers.marksheet_tasks"
]