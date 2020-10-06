from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from tracker import views

urlpatterns = [
    path('holdings/', views.HoldingList.as_view()),
    path('holdings/<int:pk>/', views.HoldingDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
