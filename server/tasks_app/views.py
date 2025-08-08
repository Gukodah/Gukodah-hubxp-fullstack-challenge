from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filterset_fields = ["status", "due_date"]
    search_fields = ["title", "description"]
    ordering_fields = ["priority", "due_date", "created_at"]

    def perform_create(self, serializer):
        print(self.request.user)
        serializer.save(owner=self.request.user)
