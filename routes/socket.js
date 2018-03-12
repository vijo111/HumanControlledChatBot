var app = require('../app');
var io = app.io;
var http = require('http');

module.exports.usernamesList = usernamesList = [[]];
module.exports.usernames = usernames = {};
module.exports.executives = executives = {};
module.exports.chatclients = chatclients = chatclients = [];
// clientconstants for demo purpose to provide clientname from array.
module.exports.clientconstants = clientconstants = ["Ajay", "Francis", "Kumar", "Raja", "Dhamu", "Kranthi", "Anand"];
module.exports.clientcount = clientcount = 0;

function smartreply(data, callback) {
	var result;
	http.get('http://127.0.0.1:8083/getReply/' + data, function (resp) {
		var buffer = '';
		resp.on('data', function (chunk) {
			//do something with chunk
			console.log('***', chunk);
			buffer += chunk;
		});
		resp.on("end", function (err) {
			// finished transferring data
			// dump the raw data
			console.log('@@@', buffer);
			result = buffer;
			console.log('result@@@', buffer);
			callback(result);
		});

	}).on("error", function (e) {
		console.log("Got error: " + e.message);
	});
	callback(result, result);
}


module.exports = function (socket) {


	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function (username) {
		username = clientconstants[clientcount++];

		executive = null;
		roomavailableFlag = false;


		// store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;

		if (chatclients == null || chatclients.length == 0) {
			var roomno = 'room';
			roomno = roomno + '1';
			// store the room name in the socket session for this client
			socket.room = roomno;
			// send client to room 1
			socket.join(socket.room);
			//This 0 index double dimension array values can be looked into usernamesList
			clientindex = 0;
			usernamesList[clientindex].push(username);
			chatclient = { 'executiveroom': socket.room, 'executive': null, 'clientindex': clientindex };
			chatclients.push(chatclient);
			socket.emit('updateusernames', usernamesList[clientindex], 'room1');
		}
		else if (chatclients != null && (username != 'undefined' || username != null)) {
			// loop each chatclient
			chatclients.forEach(function (chatclient, index) {
				executive = chatclient.executive;
				//index taken from client.
				if (chatclient.clientindex != null) {
					clientindex = chatclient.clientindex;
					userNamesListIndex = usernamesList[clientindex].length;
				}
				else {
					clientindex = 0;
					userNamesListIndex = 1;
				}
				// we can add only 5 client per executive. This should be configuration from properties.
				if (userNamesListIndex > 0 && userNamesListIndex < 5) {
					executiveroom = chatclient.executiveroom;
					executive = chatclient.executive;
					chatclients[index] = { 'executiveroom': executiveroom, 'executive': executive, 'clientindex': clientindex };
					usernamesList[clientindex].push(username);
					socket.join(chatclient.executiveroom);
					socket.emit('updatechat', username, 'Welcome to Guest Care. My name is ' + executive + '. How may i help you? ');
					socket.emit('setclientusername', username);

					// find socket id of executive and send the message
					Object.values(sockets.sockets).forEach(function (sock) {
						if (sock.username == chatclient.executive) {
							socket.broadcast.to(sock.id).emit('updatechat', 'SERVER', ' Help ' + username + '. Need your assistance');
							socket.broadcast.to(sock.id).emit('updateusernames', usernamesList[clientindex], 'room1');
						}
					});

					roomavailableFlag = true;
					return;
				}
			});
			// if room not available , create new room by getting last room from chatclients
			if (!roomavailableFlag) {
				if (chatclients.length != 0) {
					roomno = chatclients[chatclients.length - 1].executiveroom;
					var roomnumericno = parseInt(roomno.substr(roomno.length - 1, roomno.length));
					roomnumericno = roomnumericno + 1;
					roomno = 'room';
					roomno = roomno + roomnumericno;
				}
				else {
					roomno = 'room1';
				}

				socket.join(roomno);
				clientindex = usernamesList[clientindex].length + 1;
				usernamesList[clientindex].push(username);
				chatclient = { 'executiveroom': roomno, 'executive': null, 'clientindex': clientindex };
				chatclients.push(chatclient);
				socket.emit('updateusernames', usernamesList[clientindex], 'room1');
			}
		}
	});


	// when the client emits 'adduser', this listens and executes
	socket.on('addexecutive', function (executive) {
		// store the username in the socket session for this client
		socket.username = executive;
		// This for to reinitialize to have only one executive at a time for demo
		// For multiple executive. This logic has to be enhanced.
		chatclients = [];
		usernamesList = [[]];
		clientcount = 0;
		roomavailableFlag = false;
		// store the room name in the socket session for this client
		var roomno = 'room';
		roomno = roomno + '1';
		// store the room name in the socket session for this client
		socket.room = roomno;
		// add the client's username to the global list
		executives[executive] = executives;
		usernames[executive] = executive;
		//set executive room;
		executiveroom = socket.room;
		// send client to room 1
		socket.join(socket.room);
		// echo to client they've connected
		chatclient = { 'executiveroom': executiveroom, 'executive': socket.username, 'clientindex': null };
		chatclients.push(chatclient);
		socket.emit('updatechat', 'SERVER', 'You have connected in Chatroom.  Pls wait to chat with customer...');
	});


	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (tosockname, data) {
		executiveroom = null;
		clientChatFlag = false;
		executiveChatFlag = false;
		var chatclient = null;
		sockuname = null;
		if (socket.username != undefined) {
			if (chatclients.find(x => x.executive === socket.username) != undefined) {
				executiveChatFlag = true;
				chatclient = chatclients.find(x => x.executive === socket.username);
				executiveroom = chatclient.executiveroom;
				sockuname = tosockname;
			}
			else {
				clientChatFlag = true;
				chatclients.forEach(function (client, index) {
					if (usernamesList[client.clientindex].indexOf(socket.username) != -1) {
						chatclient = client;
						executiveroom = client.executiveroom;
						sockuname = client.executive;
					}
				});
			}
		}
		console.log('executiveChatFlag',executiveChatFlag);
		console.log('clientChatFlag',clientChatFlag);
		
		if (chatclient.executive != null && chatclient.clientindex != null) {
			console.log('chatclient.executive',chatclient.executive);
			console.log('chatclient.clientindex',chatclient.clientindex);
			Object.values(sockets.sockets).forEach(function (sock) {
				if (sock.username == sockuname) {
					console.log('sock.username',sock.username);
					console.log('sockuname',sockuname);
					socket.broadcast.to(sock.id).emit('updatechat', socket.username, data);
					socket.emit('updatechat', socket.username, data);

					if(clientChatFlag){
						var aiOut='';
						smartreply(data, function (response) {
							console.log('res::', response);
							aiOut = response;
							console.log('aiOut::', aiOut);
							if(null!= aiOut){
								var smartOut = aiOut.substr(1).slice(0, -1);
								socket.broadcast.to(sock.id).emit('smartExeReply',smartOut);
								socket.emit('smartExeReply', smartOut);
							}

						})
					}
				}
			});
		}

	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function () {
		var executiveroom = null;
		var clientChatFlag = false;
		var executiveChatFlag = false;
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		sockets.emit('updateusers', usernames);
		// echo that this client has left
		if (socket.username != undefined) {
			if (chatclients.find(x => x.executive === socket.username) != undefined) {
				executiveChatFlag = true;
				chatclient = chatclients.find(x => x.executive === socket.username);
				executiveroom = chatclient.executiveroom;
			}
			else {

				chatclients.forEach(function (client, index) {
					if (usernamesList[client.clientindex].indexOf(socket.username) != -1) {
						chatclient = client;
						executiveroom = client.executiveroom;
					}
				});
			}

		}
		socket.leave(executiveroom);
		socket.broadcast.to(executiveroom).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});

	// send user names list when its called from executive
	socket.on('getusernames', function () {
		executiveroom = null;
		clientChatFlag = false;
		executiveChatFlag = false;
		var chatclient = null;
		if (socket.username != undefined) {
			if (chatclients.find(x => x.client === socket.username) != undefined) {
				clientChatFlag = true;
				chatclient = chatclients.find(x => x.client === socket.username);
				executiveroom = chatclient.executiveroom;
			}
			else {
				executiveChatFlag = true;
				chatclient = chatclients.find(x => x.executive === socket.username);
				executiveroom = chatclient.executiveroom;
			}
		}
		socket.emit('updateusernames', usernamesList[chatclient.clientindex], 'room1');
	});

}
