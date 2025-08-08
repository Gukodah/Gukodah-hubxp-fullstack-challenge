from django.db import models
from django.contrib.auth import get_user_model


class Task(models.Model):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

    DEVELOPMENT = "DEVELOPMENT"
    DESIGN = "DESIGN"
    SECURITY = "SECURITY"
    TESTING = "TESTING"
    INFRASTRUCTURE = "INFRASTRUCTURE"
    RESEARCH = "RESEARCH"
    MARKETING = "MARKETING"
    ANALYTICS = "ANALYTICS"
    DEVOPS = "DEVOPS"
    AIML = "AI/ML"

    STATUS_CHOICES = [
        (TODO, "To do"),
        (IN_PROGRESS, "In progress"),
        (COMPLETED, "Completed"),
    ]

    CATEGORIES_CHOICES = [
        (DEVELOPMENT, "Development"),
        (DESIGN, "Design"),
        (SECURITY, "Security"),
        (TESTING, "Testing"),
        (INFRASTRUCTURE, "Infrastructure"),
        (RESEARCH, "Research"),
        (MARKETING, "Marketing"),
        (ANALYTICS, "Analytics"),
        (DEVOPS, "Devops"),
        (AIML, "AI/ML"),
    ]

    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="tasks"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=TODO)
    priority = models.PositiveSmallIntegerField(default=1)
    category = models.CharField(
        max_length=100, choices=CATEGORIES_CHOICES, default=DEVELOPMENT
    )
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-priority", "due_date"]

    def __str__(self):
        return self.title
