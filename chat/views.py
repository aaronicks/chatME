from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Room
from django.contrib.auth.decorators import login_required
from account.models import User

# Create your views here.


@require_POST
def create_room(request, uuid):
	name = request.POST.get('name', '')
	url = request.POST.get('url', '')

	Room.objects.create(uuid=uuid, client=name, url=url)

	return JsonResponse({'message':'room created'})



@login_required
def admin(request):

	rooms = Room.objects.all()
	users = User.objects.filter(is_staff=True)

	context = {
		'rooms':rooms,
		'users':users
	}
	return render(request, 'chat/admin.html', context)



@login_required
def room(request, uuid):

	room = Room.objects.get(uuid=uuid)

	if room.status == room.WAITING:
		room.status = room.ACTIVE
		room.agent = request.user
		room.save()

	return render(request, 'chat/room.html', {'room':room})