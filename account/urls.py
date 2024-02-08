from django.contrib.auth.views import LoginView
from django.urls import path

from .forms import LoginForm
from django.conf.urls.static import static
from django.conf import settings

app_name = 'account'


urlpatterns = [
    path('login/', LoginView.as_view(template_name='account/login.html', form_class=LoginForm), name='login')
]


