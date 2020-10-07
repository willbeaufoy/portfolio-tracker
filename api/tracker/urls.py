from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from tracker import views

urlpatterns = [
    path('holdings/', views.HoldingList.as_view(), name='holding-list'),
    path('holdings/<int:pk>/', views.HoldingDetail.as_view(), name='holding-detail'),
    path('trades/', views.TradeList.as_view(), name='trade-list'),
    path('trades/<int:pk>/', views.TradeDetail.as_view(), name='trade-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
