from django.contrib import admin
from django.urls import include, path
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("tasks_app.urls")),
    path("api/v1/", include("users_app.urls")),
]
