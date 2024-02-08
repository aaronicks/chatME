/*
*Variables
*/ 

const chatRoom = document.querySelector('#room_uuid').textContent.replaceAll('"', '')

let chatSocket = null




/*
*Elements
*/ 


const chatMessageElement = document.querySelector('#chat_message')
const chatInputElement = document.querySelector('#chat_input')
const chatSubmitElement = document.querySelector('#chat_submit')


/*
*Function
*/ 

function sendMessage() {

	chatSocket.send(JSON.stringify({
		'type':'message',
		'message': chatInputElement.value,
		'name': document.querySelector('#user_name').textContent.replaceAll('"', ''),
		'agent': document.querySelector('#user_id').textContent.replaceAll('"', ''),
	}))
	chatInputElement.value = ''
}


function onChatMessage(data) {
	console.log('onChatMessage', data)

	if (data.type == 'chat_message') {
		if (!data.agent) {
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

											<div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
												<p class="text-sm">${data.message}</p>
											</div>

												<span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
											</div>
											<div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">${data.initials}</div>
										</div>`
		}
	}
}


/*
* Setup Web Socket
*/ 


chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`)




chatSocket.onmessage = function(e) {

	console.log('On Message')

	onChatMessage(JSON.parse(e.data))
}




chatSocket.onopen = function(e){
	console.log('On Open')
}



chatSocket.onclose = function(e){
	console.log('Chat socket closed unexpectedly')
}


/*
* Event Listeners
*/ 

chatSubmitElement.onclick = function(e) {
	e.preventDefault()

	sendMessage()

	return false
}