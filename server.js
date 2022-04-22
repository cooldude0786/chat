var express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var name , ListOfUser=[],channel = []
let port = 4046;
app.get("/", (req, res) => res.sendFile(__dirname + "/updateone.html"));
app.use("/public", express.static(__dirname + "/public"));

var admin = require("firebase-admin");

var serviceAccount = require("./chat-io-3de79-firebase-adminsdk-ospcz-293df2c39e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-io-3de79-default-rtdb.asia-southeast1.firebasedatabase.app"
});

// Import Admin SDK
const { getDatabase } = require('firebase-admin/database');

// Get a database reference to our blog
const db = getDatabase();
const ref = db.ref('User'),ref2=db.ref('Chat');
ref.child("D").set(null);
const usersRef = ref.child('users');
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: 'June 23, 1912',
//     full_name: 'Alan Turing'
//   },
//   gracehop: {
//     date_of_birth: 'December 9, 1906',
//     full_name: 'Grace Hopper'
//   }
// }); 
function InsertUserEntrie(){
	let ref = db.ref('User/ChatJoined')
	let usersRef = ref.child(arguments[0])
	usersRef.set({
		UserName: arguments[0] ,
		JoiningTime : Date().substr(0,25)
	});
	// usersRef.remove("willdel");
}
function GetContactFromFirebase(){
ref2.on('value', (snapshot) => {
	let  obj = snapshot.val()  
  let result = obj; 
  for(var k in result) {
   if(channel.length==0) //checking that the array is empty and let the first channel get in the array from fierbase
   	channel.push(k)
   else if(channel.find(elem => elem == k) == undefined){ // checking that the channel code is alredy in the array
   	// console.log("come in the k part")
   	channel.push(k)
   }
}
console.log("Data From Firebase",channel)
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
}); 
}





GetContactFromFirebase()


http.listen(port, '0.0.0.0', () => console.log(`listening on http://localhost:${port}`));
io.on("connection", function(socket) {

		// InsertUserEntry()
		socket.on("disconnect", function(msg) {
		io.emit("dis","The User is Leaving")
		ListOfUser=[]
		io.emit("message",{Type : "Joining",
							Message : "User Leave the Chat"});
		// console.log('Dead!'+msg[1]);
	});
		socket.on("message", function(msg) {
   		io.emit("message", msg);
  		// console.log("useer send a message :"+msg)
 });

		socket.on("peoplename",async (msg)=>{
			// console.log("msg:= ",msg)
			ListOfUser.push(msg)  
			// console.log("active people in ListOfUser array:=",ListOfUser,ListOfUser.length)
			await io.emit("UserLoggIn",ListOfUser) 
		});
		socket.on('joining msg', function(msg){

		name=msg[1]
		// console.log("joing the chat")
		InsertUserEntrie(name)
		ListOfUser.push(name)
		msg[1] = msg[1]+" join the Chat"
		io.emit("message", {Type : "Joining",
							Name : name,
							Message : name+" join the Chat"});
		// console.log(msg[1],ListOfUser)
		io.emit("UserLoggIn",ListOfUser)
	});
 
		// ListOfUser.forEach((channelName)=>{
			socket.on("E2E",(msg)=>{
				GetContactFromFirebase()
				const d = new Date()
				io.emit(msg.Receiver,msg)
			var check=false	
			if(channel.includes(msg.Sender+"-"+msg.Receiver)){
				check = false
			}else if(channel.includes(msg.Receiver+"-"+msg.Sender)){
				check = true
			}
   			
let ref = (check == false) ? db.ref('Chat/'+msg.Sender+'-'+msg.Receiver) : db.ref('Chat/'+msg.Receiver+'-'+msg.Sender)
		let date = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()
				let usersRef = ref.child(date)
				usersRef.set({
					Message : msg.message,
					User : msg.Sender
				})  
			})//on socket end
		// });//for each end
  
   
});   
