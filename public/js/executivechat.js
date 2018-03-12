
function performSocketSetup() {
    var socket = io.connect('http://192.168.61.162:8080');
    var disconnectedflag = false;

    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function () {
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        window.localusername = "Clement";
        socket.emit('addexecutive', localusername);
        window.userChatContent = {};
    });

    // listener, whenever the server emits 'updatechat', this updates the chat body
    socket.on('updatechat', function (username, data) {
        var dynamicstring = "";
        $("#executivename")[0].innerHTML = "";
        $("#chatcontent")[0].innerHTML = "";
        $("#executivename")[0].innerHTML = "<span>" + window.localusername + "</span>";

        socket.emit('getusernames');

        // To set first time current user
        if (username != window.localusername) {
            window.currentUser = username;
            $("#clientusername")[0].innerHTML = window.currentUser;
        }

        if (username != localusername) {
            dynamicstring = dynamicstring + '<div class="row col-md-12 chat-origin-user"> <span class="chat-left">';
            if (username == 'SERVER') {
                dynamicstring = dynamicstring + ' SYSTEM ';
            }
            else {
                dynamicstring = dynamicstring + window.currentUser;
            }

            dynamicstring = dynamicstring + '</span>';
        }
        else {
            dynamicstring = dynamicstring + '<div class="row col-md-12 chat-origin-user d-flex ml-3 justify-content-end">';
            dynamicstring = dynamicstring + '<span class="chat-right">';
            dynamicstring = dynamicstring + ' You ';
            dynamicstring = dynamicstring + '</span>';
        }

        dynamicstring = dynamicstring + '</div>';

        if (username != localusername) {

            dynamicstring = dynamicstring + '<div class="row msg_container base_receive">';
            dynamicstring = dynamicstring + '<div class="col-md-12 col-xs-12">';
            dynamicstring = dynamicstring + '<div class="messages msg_receive">';
            dynamicstring = dynamicstring + '<p id="chatmsg1" class="pl-3">' + data + '</p>';
            dynamicstring = dynamicstring + ' </div>  </div> </div>';
        }
        else {
            dynamicstring = dynamicstring + '<div class="row msg_container base_receive">';
            dynamicstring = dynamicstring + '<div class="col-md-12 col-xs-12">';
            dynamicstring = dynamicstring + '<div class="messages msg_receive">';
            dynamicstring = dynamicstring + '<p id="chatmsg2" class="pl-3">' + data + '</p>';
            dynamicstring = dynamicstring + ' </div>  </div>  </div>'
        }

        // if executive send message store msg  in correct object
        if (window.localusername == username) {
            if (window.currentUser != undefined || window.currentUser != null) {
                window.userChatContent[window.currentUser] = (window.userChatContent[window.currentUser] == undefined) ? dynamicstring : (window.userChatContent[window.currentUser] + dynamicstring);
              }
        } // if other message from executive
        else {
            window.userChatContent[username] = (window.userChatContent[username] == undefined) ? dynamicstring : (window.userChatContent[username] + dynamicstring);
          }

        if (window.currentUser != undefined || window.currentUser != null) {
            $("#chatcontent").append(window.userChatContent[window.currentUser]);
        }
        else {
            $("#chatcontent").append(window.userChatContent[username]);
        }

    });

    socket.on('smartExeReply', function ( data) {
        //alert('data@@@',data)
        if(null!=document.getElementById('data')){
            document.getElementById('data').value=data;
        }
    });

    // listener, whenever the server emits 'updaterooms', this updates the room the client is in
    socket.on('updateusernames', function (usernamesList, current_room) {
        window.usernamesList = usernamesList;
        var users = "";
        if (usernamesList != null && usernamesList.length == 1) {
            window.currentUser = usernamesList[0];
        }

        $("#users-list")[0].innerHTML = "";
        $.each(usernamesList, function (key, value) {
            users = users + '<li class="list-group-item">';
            users = users + '<a class="btn btn-secondary" role="button" href="#" onclick="fetchclientchat(\'' + value + '\')">';
            users = users + value;
            users = users + '</a>';
            users = users + '</li>';
        });
        $("#users-list").append(users);
    });


    // when the client clicks SEND
    $('#datasend').click(function () {
        var message = $('#data').val();
        $('#data').val('');

        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', window.currentUser, message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function (e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });
}


function fetchclientchat(value) {
    window.currentUser = value;
    //clear old content and append stored in userchatcontent
    $("#chatcontent")[0].innerHTML = "";
    $("#chatcontent").append(window.userChatContent[window.currentUser]);
    $("#clientusername")[0].innerHTML = window.currentUser;
}

function initializeEvents() {

    var actualWidth = $("#sidebar").width();
    $("#content-parent").css({ 'left': actualWidth + "px" })

    $('#togglesb').click(function () {
        var options = {};
        var actualWidth = $("#sidebar").width();
        var currentPosition = $("#content-parent").css('left');
        var status = $("#sidebar").attr('status');
        var animDir = "-";
        var startOffset = "80%";
        var endOffset = "0";

        if (status == null || status == 'visible') {
            $("#sidebar").attr('actualWidth', actualWidth);
            $("#sidebar").attr('status', 'hidden');
            startOffset = "99.99%";
        } else {
            $("#sidebar").attr('status', 'visible');
            endOffset = $("#sidebar").attr('actualWidth');
            animDir = "+";
        }
        //console.log('value ' + actualWidth + 'endOffset: ' + endOffset);
        $("#sidebar").toggle('slide', { direction: "left" }, 500);
        $("#content-parent").animate({ "left": endOffset + "px", "width": startOffset }, 500, "swing");
      });
}
