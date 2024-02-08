/*
*var
*/ 
let chatName = ''
let chatSocket = null
let chatWindowUrl = window.location.href
let chatRoomUuid = Math.random().toString(36).slice(2, 12)




/*
*Elements
*/ 


const chatElement = document.querySelector('#chat')
const chatOpenElement = document.querySelector('#chat_open')
const chatJoinElement = document.querySelector('#chat_join')
const chatIconElement = document.querySelector('#chat_icon')
const chatWelcomeElement = document.querySelector('#chat_welcome')
const chatRoomElement = document.querySelector('#chat_room')
const chatNameElement = document.querySelector('#chat_name')
const chatMessageElement = document.querySelector('#chat_message')
const chatInputElement = document.querySelector('#chat_input')
const chatSubmitElement = document.querySelector('#chat_submit')




/*
Functions
*/ 

function scrollToBottom() {
	chatMessageElement.scrollTop = chatMessageElement.scrollHeight
}


function getCookie(name){

	var cookieValue = null

	if (document.cookie && document.cookie != ''){
		var cookies = document.cookie.split(';')

		for (var i = 0; i < cookies.length; i++){
			var cookie = cookies[i].trim()


			if (cookie.substring(0, name.length + 1) === (name + '=')){
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1))

				break
			}
		}
	
	}
	return cookieValue
}



function sendMessage() {

	chatSocket.send(JSON.stringify({
		'type':'message',
		'message': chatInputElement.value,
		'name':chatName
	}))
	chatInputElement.value = ''
}


function onChatMessage(data) {
	console.log('onChatMessage', data)

	if (data.type == 'chat_message') {
		let tmpInfo = document.querySelector('.tmp-info')

		if (tmpInfo) {
			tmpInfo.remove()
		}

		if (data.agent) {
			chatMessageElement.innerHTML += `
										<div class="flex w-full mt-2 space-x-3 max-w-md">
												
											<div>

											<div class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
												<p class="text-sm">${data.message}</p>
											</div>

												<span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
											</div>
											<div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>
										</div>`
		} else {
			chatMessageElement.innerHTML += `
										<div class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end">
												
											<div>

											<div class="bg-blue-600 p-3 rounded-l-lg rounded-br-lg">
												<p class="text-sm">${data.message}</p>
											</div>

												<span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
											</div>
											<div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>
										</div>`
		}
	} 
	else if (data.type == 'users_update'){
		chatMessageElement.innerHTML += '<p class="mt-2"><b> The Admin/Agent joined the chat!</b></p>'
	}else if (data.type == 'writing_active'){
		if (data.agent) {
			let tmpInfo = document.querySelector('.tmp-info')


			if (tmpInfo) {
				tmpInfo.remove()
			}

			chatMessageElement.innerHTML += `
										<div class="tmp-info flex w-full mt-2 space-x-3 max-w-md">
												
											<div>

											<div class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
												<p class="text-sm">Typing....</p>
											</div>
											</div>
											<div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>
										</div>`
		}
	}

	
	scrollToBottom()
}


async function joinChatRoom(){

	console.log('joinChatRoom')

	chatName = chatNameElement.value

	console.log('Join as:', chatName)
	console.log('Room uuid:', chatRoomUuid)

	const data = new FormData()
	data.append('name', chatName)
	data.append('url', chatWindowUrl)

	await fetch(`api/create_room/${chatRoomUuid}`,{
		method:'POST',
		headers:{
			'X-CSRFToken': getCookie('csrftoken')
		},
		body: data
	})
	.then(function(res) {
		return res.json()
	})
	.then(function(data){
		console.log('data', data)
	})

	chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoomUuid}/`)

	chatSocket.onmessage = function(e) {
		console.log('onMessage')

		onChatMessage(JSON.parse(e.data))
	}

	chatSocket.onopen = function(e) {

		console.log('onOpen - Chat Socket Was Open')

		scrollToBottom()
	}

	chatSocket.onclose =  function(e){
		console.log('onClose - Chat Socket Was Closed')
	}
}




/*
*Event Listeners
*/ 


chatOpenElement.onclick = function(e) {
	e.preventDefault()				//do not reload page

	chatIconElement.classList.add('hidden')
	chatWelcomeElement.classList.remove('hidden')

	return false
}



chatJoinElement.onclick = function(e) 
{
	e.preventDefault()				//do not reload page

	chatWelcomeElement.classList.add('hidden')
	chatRoomElement.classList.remove('hidden')

	joinChatRoom()

	return false
}



chatSubmitElement.onclick = function(e) {
	e.preventDefault()

	sendMessage()

	return false
}




chatInputElement.onkeyup = function(e) {
	if (e.keyCode == 13) {
		sendMessage()
	}
}
	

	