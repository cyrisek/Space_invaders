from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('new_score', views.new_score, name='new_score'),
]
