
from django.shortcuts import render, redirect
import json
from django.http import JsonResponse
from django.contrib.auth.models import Group, User
from django.views.decorators.http import require_POST
from .models import Room
from django.contrib.auth.decorators import login_required
from account.models import User
from account.forms import AddUserForm, EditUserForm
from django.contrib import messages
from django.contrib.auth import logout


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


@login_required
def delete_room(request, uuid):

	if request.user.has_perm('room.delete_room'):
		room = Room.objects.get(uuid=uuid)
		room.delete()
		messages.info(request, 'The Room Was Deleted!')

		return redirect('/chat-admin/')
	else:

		messages.error(request, 'You dont\'t access to delete users!')

		return redirect('/chat-admin/')


@login_required
def user_detail(request, uuid):
	user = User.objects.get(pk=uuid)
	rooms = user.rooms.all()


	return render(request, 'chat/user_detail.html', {'user':user, 'rooms':rooms})


@login_required
def edit_user(request, uuid):

	if request.user.has_perm('user.add_user'):
		user = User.objects.get(pk=uuid)

		if request.method == 'POST':
			form = EditUserForm(request.POST, instance=user)

			if form.is_valid():
				form.save()
				messages.success(request, 'The Changes Was Saved!')

				return redirect('/chat-admin/')
		else:	
			form = EditUserForm(instance=user)

			return render(request, 'chat/edit_user.html', {'user':user, 'form':form})
	else:
		messages.error(request, 'You dont\'t access to edit users!')

		return redirect('/chat-admin/')

@login_required
def logout_user(request):
	logout(request)
	messages.success(request, 'You have been logout Successfully!')
	return redirect('/chat-admin/')

@login_required
def add_user(request):
	
	if request.user.has_perm('user.add_user'):

		if request.method == 'POST':

			form = AddUserForm(request.POST)

			if form.is_valid():

				user = form.save(commit=False)
				user.is_staff = True
				user.set_password(request.POST.get('password'))
				user.save()

				if user.role == User.MANAGER:

					group = Group.objects.get(name='Managers')
					group.user_set.add(user)

				messages.info(request, 'The user was added!')

				return redirect('/chat-admin/')
		else:
			form = AddUserForm()
			
		return render(request, 'chat/add_user.html', {'form':form})
	else:
		messages.error(request, 'You dont\'t access to add users!')

		return redirect('/chat-admin/')

