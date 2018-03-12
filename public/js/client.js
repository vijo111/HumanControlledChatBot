document.write("<!DOCTYPE html>");
document.write("<html lang=\"en\">");
document.write("<head>");
document.write("    <title>CIT Chat application<\/title>");
document.write("    <meta charset=\"utf-8\">");
document.write("    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
document.write("    <link rel=\"stylesheet\" type=\"text\/css\" href=\"..\/css\/chat.css\">");
document.write("    <link rel=\"stylesheet\" href=\"https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.7\/css\/bootstrap.min.css\" crossorigin=\"anonymous\">");
document.write("    <link rel=\"stylesheet\" href=\"https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.7\/css\/bootstrap-theme.min.css\"  crossorigin=\"anonymous\">");
document.write("");
document.write("");
document.write("<\/head>");
document.write("");
document.write("<body>");
document.write("    <div id=\"maincontainer\" class=\"container\">");
document.write("        <div class=\"row chat-window col-xs-7 col-md-5\" id=\"chat_window_1\" style=\"width:460px\">");
document.write("            <div class=\"col-xs-12 col-md-12\">");
document.write("                <div id=\"chat-panel\" class=\"panel panel-default\">");
document.write("                    <div class=\"panel-heading top-bar\">");
document.write("                        <div id =\"panelheaderid\" class=\"col-md-10 col-xs-10 icon_minim pad-10 \" style=\"text-align: left; padding-left:5px\">");
document.write("                            <h3 class=\"panel-title\"><span class=\"glyphicon glyphicon-comment\"><\/span><span class=\"pad-10\">Need Assitance? <\/span><\/h3>");
document.write("                        <\/div>");
document.write("                        <div class=\"col-md-2 col-xs-2\">");
document.write("                          <!--<a href=\"#\"><span id=\"minim_chat_window\" class=\"glyphicon glyphicon-minus icon_minim\"><\/span><\/a>-->");
document.write("                          <a role =\"button\" class=\"btn btn-secondary\" href=\"#\">&nbsp;&nbsp;&nbsp;&nbsp;<span id=\"closewindow\" class=\"glyphicon icon_close  glyphicon-remove\" data-id=\"chat_window_1\"><\/span><\/a>");
document.write("");
document.write("                        <\/div>");
document.write("                    <\/div>");
document.write("                    <div class=\"panel-body\" style=\"padding: 0px;\">");
document.write("                        <div class=\"content-div\" style=\"height : 380px;\">");
document.write("                            <div id=\"dynamiccontent\" style=\"height : 360px; overflow-y: scroll; overflow-x: hidden;\">");
document.write("                            <\/div>");
document.write("                        <\/div>");
document.write("                        <div class=\"panel-footer\">");
document.write("                            <div class=\"input-group\">");
document.write("                                <input id=\"data\" type=\"text\" class=\"form-control input-sm chat_input\" placeholder=\"Type your message here\" \/>");
document.write("                                <span class=\"input-group-btn\">");
document.write("                                    <button class=\"btn btn-primary btn-sm\" id=\"datasend\">Send<\/button>");
document.write("                                <\/span>");
document.write("                            <\/div>");
document.write("                        <\/div>");
document.write("                    <\/div>");
document.write("                <\/div>");
document.write("            <\/div>");
document.write("");
document.write("");
document.write("        <\/div>");
document.write("    <\/div>");
document.write("<\/body>");
document.write("");
document.write("<\/html>");

var scriptsToLoad = ["https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js", "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js", "/socket.io/socket.io.js", "../js/chat.js"];
var socket = null;
var firsttime = true;
// Load scripts on the fly
(function () {
    var loadedScriptsCount = 0;

    var fnOnScriptFileLoadComplete = function () {
        if (++loadedScriptsCount == scriptsToLoad.length) {
            // All the scripts are loaded
            fnDocumentReady();
        }
        else {
            // Load next script
            fnLoadScriptAtIndex(loadedScriptsCount);
        }
    }

    var fnLoadScriptAtIndex = function (index_) {
        if (scriptsToLoad.length > index_) {
            var scriptTag = document.createElement("script");
            scriptTag.onload = fnOnScriptFileLoadComplete;
            scriptTag.setAttribute("src", scriptsToLoad[index_]);
            document.head.appendChild(scriptTag);
        }
        else {
            fnDocumentReady();
        }
    }

    fnLoadScriptAtIndex(0);
})();

function fnDocumentReady() {
    var isExpanded = false;
    initializeEvents();
    expandChatWindow($('.panel-heading span.icon_minim'));
    // when the client clicks SEND
    $('#datasend').click(function () {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', 'constant', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function (e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });
    window.emitdisc = function emitdisconnect() {
        window.socket.emit('disconnect');

    }
}

function connectsocket() {

    if (firsttime == true) {
        socket = io.connect('http://192.168.61.162:8080');
        socket.on('connect', function () {
            var localusername = "temp";
            window.localusername = localusername;
            socket.emit('adduser', localusername);
        });

        socket.on('setclientusername', function (clientusername) {
            window.localusername = clientusername;
        });

        firsttime = false;

        socket.on('updatechat', function (username, data) {
            var dynamicstring = "";
            if (username != localusername) {
                dynamicstring = dynamicstring + '<div class="row msg_container base_receive">';
                dynamicstring = dynamicstring + '<div class="col-md-2 col-xs-2 avatar">';
                if (username == 'SERVER') {
                    dynamicstring = dynamicstring + '<img src="system-settings-icon.png" class=" img-responsive ">';
                }
                else {
                    dynamicstring = dynamicstring + '<img src="telemarketer.png" class=" img-responsive ">';
                }
                dynamicstring = dynamicstring + '</div>';
                dynamicstring = dynamicstring + '<div class="col-md-10 col-xs-10">';
                dynamicstring = dynamicstring + '<div class="messages msg_receive">';
                dynamicstring = dynamicstring + '<p>' + data + '</p>';
                dynamicstring = dynamicstring + ' </div>  </div> </div>';
            }
            else {
                dynamicstring = dynamicstring + '<div class="row msg_container base_receive">';
                dynamicstring = dynamicstring + '<div class="col-md-10 col-xs-10">';
                dynamicstring = dynamicstring + '<div class="messages msg_send">';
                dynamicstring = dynamicstring + '<p>' + data + '</p>';
                dynamicstring = dynamicstring + ' </div>  </div>  '
                dynamicstring = dynamicstring + '<div class="col-md-2 col-xs-2 avatar">';
                dynamicstring = dynamicstring + '<img src="chat-user.png" class=" img-responsive ">';
                dynamicstring = dynamicstring + '</div> </div>';
            }

            $("#dynamiccontent").append(dynamicstring);
            $("#dynamiccontent")[0].scrollTop = $("#dynamiccontent")[0].scrollHeight + 30;
        });

    }

}