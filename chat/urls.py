from django.urls import path
from . import views

app_name = 'chat'

urlpatterns =[
	path('api/create_room/<str:uuid>', views.create_room, name="create_room"),
	path('chat-admin/', views.admin, name='admin'),
	path('chat-admin/<str:uuid>/', views.room, name='room'),
]