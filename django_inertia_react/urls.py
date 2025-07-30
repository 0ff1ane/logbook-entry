"""
URL configuration for django_inertia_react project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .ninja_api import ninja_api
from templates import views as inertia_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", ninja_api.urls),
    path("", inertia_views.login, name="Login"),
    path("logbooks", inertia_views.logbooks, name="LogBooksTable"),
    path("logbooks/new", inertia_views.new_logbook, name="NewLogBook"),
    path("logbook/<int:logbook_id>", inertia_views.logbook, name="LogBook"),
    path("log", inertia_views.log, name="Log"),
]
