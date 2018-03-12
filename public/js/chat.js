

function initializeEvents() {

    var _fnHandleResize = function () {
        if ($('.panel-heading .icon_minim').hasClass('panel-collapsed')) {
            positionChatWindow('collapsed', getContentDimension());
        } else {
            positionChatWindow('expanded', getContentDimension());
        }
    }

    $(window).resize(_fnHandleResize);

    $(document).on('click', '.panel-heading .icon_minim', function (e) {
        var $this = $(this);
        if ($this.hasClass('panel-collapsed')) {
            expandChatWindow($this);
        } else {
            collapseChatWindow($this);
        }
    });

    $(document).on('focus', '.panel-footer input.chat_input', function (e) {
        var $this = $(this);
        if ($('#panelheaderid').hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideDown();
            $('#panelheaderid').removeClass('panel-collapsed');
        }
    });
    $(document).on('click', '#new_chat', function (e) {
        var size = $(".chat-window:last-child").css("margin-left");
        size_total = parseInt(size) + 400;
        alert(size_total);
        var clone = $("#chat_window_1").clone().appendTo(".container");
        clone.css("margin-left", size_total);

    });
    $(document).on('click', '.icon_close', function (e) {
        $("#chat_window_1").remove();
        window.location.href = "http://localhost:8080/client";
    });

    storeContentDimension();
    storeChatWindowDimension();
    _fnHandleResize();
}

function positionChatWindow(action, contentDimension) {

    var chatWindow = $('#maincontainer');
    var windowDimension = getWindowDimension();
    var chatWindowDimension = getChatWindowDimension();

    var left = windowDimension.windowWidth - contentDimension.contentWidth - 60;
    var top = windowDimension.windowHeight;

    if (action == 'collapsed') {
        top = top - (parseInt($('.panel-heading').height() + 30));
    } else {
        top = top - (parseInt(chatWindowDimension.chatWindowHeight) - 10);
    }

    $("#maincontainer").css("width", chatWindowDimension.chatWindowWidth);
    $("#maincontainer").css("height", chatWindowDimension.chatWindowHeight);
    $("#chat_window_1").css("width", chatWindowDimension.chatWindowWidth);
    $("#chat_window_1").css("height", chatWindowDimension.chatWindowHeight);
    $("#maincontainer").css("left", left + "px");

    $("#maincontainer").animate({ 'top': top + "px" });
    //  console.log(top);
}

function getWindowDimension() {

    var dimension = {};

    dimension.windowWidth = $(window).width();
    dimension.windowHeight = $(window).height();

    return dimension;
}

function getChatWindowDimension() {

    var dimension = {};

    dimension.chatWindowWidth = $('#chat_window_1')[0].clientWidth;
    dimension.chatWindowHeight = $('#chat_window_1')[0].clientHeight;

    console.log('Height: ' + dimension.chatWindowHeight + ' Width: ' + dimension.chatWindowWidth);

    return dimension;
}

function storeChatWindowDimension() {

    var dimension = {};

    dimension.chatWindowWidth = $('#chat_window_1')[0].clientWidth;
    dimension.chatWindowHeight = $('#chat_window_1')[0].clientHeight;

    $('#chat_window_1').attr('xwidth', dimension.chatWindowWidth);
    $('#chat_window_1').attr('xheight', dimension.chatWindowHeight);

    console.log('Height: ' + dimension.chatWindowHeight + ' Width: ' + dimension.chatWindowWidth);

    return dimension;
}

function getChatWindowDimension() {

    var dimension = {}
    dimension.chatWindowWidth = $('#chat_window_1').attr('xwidth');
    dimension.chatWindowHeight = $('#chat_window_1').attr('xheight');

    return dimension;

}

function storeContentDimension() {
    var dimension = {};

    dimension.contentWidth = $('#dynamiccontent')[0].clientWidth;
    dimension.contentHeight = $('#dynamiccontent')[0].clientHeight;

    $('#dynamiccontent').attr('xwidth', dimension.contentWidth);
    $('#dynamiccontent').attr('xheight', dimension.contentHeight);

    console.log('Content Height: ' + dimension.contentHeight + ' Content Width: ' + dimension.contentWidth);

    return dimension;
}

function getContentDimension() {

    var contentDimension = {}
    contentDimension.contentWidth = $('#dynamiccontent').attr('xwidth');
    contentDimension.contentHeight = $('#dynamiccontent').attr('xheight');

    return contentDimension;

}

function expandChatWindow(object) {

    object.parents('.panel').find('.panel-body').slideDown('fast', function () {
        object.removeClass('panel-collapsed');
        positionChatWindow('expanded', getContentDimension());
    });

    window.parent.connectsocket();
}

function collapseChatWindow(object) {

    object.parents('.panel').find('.panel-body').slideUp('fast', function () {
        object.addClass('panel-collapsed');
        positionChatWindow('collapsed', getContentDimension());
    });
}