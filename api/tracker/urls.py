from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from tracker import views

urlpatterns = [
    path('holdings/', views.HoldingList.as_view(), name='holding-list'),
    path('holdings/<int:pk>/', views.HoldingDetail.as_view(), name='holding-detail'),
    path('instruments/', views.InstrumentList.as_view(), name='instrument-list'),
    path('instruments/<int:pk>/', views.InstrumentDetail.as_view(),
         name='instrument-detail'),
    path('instruments/sync/',
         views.InstrumentViewSet.as_view({'get': 'sync'}), name='instrument-sync'),
    path('trades/', views.TradeList.as_view(), name='trade-list'),
    path('trades/<int:pk>/', views.TradeDetail.as_view(), name='trade-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
