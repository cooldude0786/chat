// console.log("Hello");
		var a = document.querySelector("span")
	a.innerHTML = name

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
	const firebaseConfig = {
	    apiKey: "AIzaSyArozbdTXvE48PJJ6vmfvlJhYw8piGasUU",
	    authDomain: "chat-io-3de79.firebaseapp.com",
	    databaseURL: "https://chat-io-3de79-default-rtdb.asia-southeast1.firebasedatabase.app",
	    projectId: "chat-io-3de79",
	    storageBucket: "chat-io-3de79.appspot.com",
	    messagingSenderId: "404478950204",
	    appId: "1:404478950204:web:c1f29fa040abc669d7fc39"
	  };

	  // Initialize Firebase
	  const app = initializeApp(firebaseConfig);
	  import {getDatabase, ref, set, child, update, remove}
	  from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js"
	  const db = getDatabase();
	  var user="User"+name
	function InsertUserEntry(){
	  	set(ref(db,"User/JoinedUser--"+name+Date().substr(0,25)),{
	  		UserName:name,
	  		JoiningTime : Date()
	  	})
	  	.then(()=>{console.log("name register");})
	  	.catch((error)=>{console.log(error)})
	  }
function InsertUserChats(){
	  set(ref(db,"Chat/"+name+"Chats/SendTime"+Date().slice(16,-31)),{
	  		Time : Date().slice(16,-31),
	  		message : arguments[0],
	  		To : arguments[1]
	  	})
	  	.then(()=>{console.log("name register");})
	  	.catch((error)=>{console.log(error)})}


	// console.log(name)
 	const form = document.querySelector("form");
	const input = document.querySelector("input");
  	var messageList = document.getElementById("GroupChatScreen");
 	const socket = io();
  	var board = document.getElementById('chat-board')
  	var Screens = board.querySelectorAll("ul")
 // socket.emit('message', ['new','joining',name]);
 socket.emit('joining msg', [false,name]);
	// InsertUserEntry()

 var FinalMessage,content;
 form.addEventListener("submit", function(e){
 	e.preventDefault();
 	if(input.value == ''){return}
 	var receiver = document.getElementById('sendto').innerText,obj={Type:"Message",Name:name ,Message: input.value ,Receiver: receiver, medium: Channel };
 	// console.log("Sending the message =>",{Type:"Message",Name:name ,Message: input.value ,Receiver: receiver, medium: Channel })
 	var ex="Message"
 	if(Channel!=ex){
 		obj={Type:"E2E", Receiver: Channel ,Sender: name ,message: input.value}
 		socket.emit("E2E",obj )
 		console.log("Sending the message "+{Type:"E2E", Receiver: Channel ,Sender: name ,message: input.value})
 		var a = document.getElementById("GroupChatScreen")
 		console.log(a)
 		const li = document.createElement("li");
 		li.classList.add('p-2','ml-auto');
		content ='<div class="bgcolor px-2 bgcol bl">'+input.value+'</div>';
		li.innerHTML = content
		a.append(li)
		Screens.scrollTop = board.scrollHeight

 	}
 	else
 		socket.emit("message",obj);
 	input.value = '';
 	sendToUser("Everyone");
 });
function addMessageToHTML(message) {
  	console.log(message)
  	
  	// console.log("medium",Channel)
  	const li = document.createElement("li");
  	// if(message.medium == name){
  	// 	console.log('end to end done')
  	// }
	if(message.Type=="E2E"){
		console.log("enter E2E")
		const li = document.createElement('li');
		li.classList.add('p-2');
		var a = document.getElementById("GroupChatScreen")
		if(message.Receiver == name){
			console.log("Enter into receiver ")
			li.classList.add('bgcol')
			li.classList.add('bgcolor','px-2','br')
			content ='<div class="bgcolor px-2 bgcol bl">'+message.message+'</div>';
		}else{
			li.classList.add('p-2','ml-auto');
			content ='messageasxasxasde';
		}
		li.innerHTML = content
		// console.log(message_list)
		if(a.append(li)){console.log("done appendng")}
	}
  	if(message.Type=="Message"){
  		console.log(message)

		if(message.Name == name){
			li.classList.add('p-2','ml-auto');
			(message.Receiver != "Everyone" )?content = '<div class="bgcolor px-2 bgd2d bl">'+message.Message+'</div>':content ='<div class="bgcolor px-2 bgcol bl">'+message.Message+'</div>';
		}else{
				if(message.Receiver!="Everyone"){
			  		if (message.Receiver != name){
				  		return
			  		}
			  	}
			(message.Receiver == name)?li.classList.add('bgd2d'):li.classList.add('bgcol')
			li.classList.add('bgcolor','px-2','br')
			content = message.Name+' : '+message.Message
		}
	  	li.innerHTML += content;
  	}
  		if(message.Type == "Joining"){
  		// console.log("pass joinnig if block")
  		li.classList.add('ml-auto','mr-auto','py-2')
  		li.style.textAlign = "center"
  		// li.innerText = message[1]+""+message[2]+""+message[3]
  			li.innerHTML ='<div class="px-2 jointtxt rounded">'+message.Message+'</div>'
  				socket.on("UserLoggIn",(msg)=>{

  				var contact_content = '<li><button class="btn btn-outline-info border-0 pr-1 pl-1" onclick="ChangeScreen(0,this.innerText)" type="button">Group Chat</button></li>'
  				var content = '<button class="dropdown-item" type="button" onclick="sendToUser(this.innerText)">Everyone</button>';
  				var i = 1;
  				msg.forEach((item)=>{
  				if(item == name)
  					 { return; }
  				content += '<button class="dropdown-item" type="button" onclick="sendToUser(this.innerText)">'+item+'</button>'
  				contact_content += '<li onclick="GetData()"><button class="btn btn-outline-info border-0" onclick="ChangeScreen('+i+',this.innerText) " type="button">'+item+'</button></li>'
  				i = i + 1;
  				if(board.getElementsByClassName(item).length !=1 )
  					{
  						board.innerHTML += '<ul class="d-none ul p-0 m-0 '+item+'" id="ul'+item+'"><li class="ml-auto mr-auto py-2" style="text-align: center;"></li></ul>'
  					}
  				else{
  					 return ;
  					}
  			})






  			document.getElementById("dropdown-menu").innerHTML = content;
  			document.getElementById("Contact_list").innerHTML = contact_content

  		});
  		// console.log(message)
  	}
  	// console.log("sender name "+message[0]+" receiver name :"+name)
			  	board.children[0].append(li)
  	board.scrollTop = board.scrollHeight
  }

function GetData(){
	console.log("getting the data boss")
}

socket.on("UserLoggIn",(msg1)=>{
	// console.log("Active people",msg1)
	document.getElementById("dropdown-menu").innerHTML += '<button class="dropdown-item" type="button" onclick="sendToUser(this.innerText)">'+msg1[ [msg1.length - 1] ]+'</button>'})

socket.on("message", addMessageToHTML);

socket.on(name, addMessageToHTML);

socket.on("dis",(msg)=>{
 	socket.emit("peoplename",name)
 	console.log(msg)})
socket.on("")