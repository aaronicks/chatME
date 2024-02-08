/*
*Variables
*/ 

const chatRoom = document.querySelector('#room_uuid').textContent.replaceAll('"', '')

let chatSocket = null

console.log('chatroom:', chatRoom)



/*
*Elements
*/ 


const chatMessageElement = document.querySelector('#chat_message')
const chatInputElement = document.querySelector('#chat_input')
const chatSubmitElement = document.querySelector('#chat_submit')


/*
* Setup Web Socket
*/ 


chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`)

chatSocket.onmessage = function(e){
	console.log('on Message')
}

chatSocket.onopen = function(e){
	console.log('on Open')
}

chatSocket.onclose = function(e){
	console.log('Chat Socket closed unexpectedly')
}