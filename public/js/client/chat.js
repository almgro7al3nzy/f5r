$(function () {
    /*$('#chat-screen').bind("DOMSubtreeModified", function () {
        var objDiv = document.getElementById("chat-screen");
        objDiv.scrollTop = objDiv.scrollHeight;
    });*/

    $('#msg-input').keypress(function (e) {
        if (e.which == 13) {
            $("#send-btn").click();
        }
    });

    $('.head-bar').on('click', '.mobile-drop-menu', (event) => {
        $(".head-bar>span.active").removeClass("active");
        $(event.currentTarget).addClass('active');
    });

    $('#member-list-box').on('click', '.item', (event) => {
        let userRes = $(event.currentTarget).find('.user-id').text();
        $('#msg-input').val("/whisper " + userRes + " ");
    });
});

function chatBoxAddMsg(tagId, id, msg, option) {
    if (typeof option !== "undefined") {
        if (option == "whisper") {
            $('#' + tagId).append(
                '<div class="msg-box">' +
                '<div class="name"><u>' + id + '</u></div>' +
                '<div class="msg-frame whisper"><span class="msg">' + msg + '</span></div>' +
                '</div>'
            );
        }
    } else {
        $('#' + tagId).append(
            '<div class="msg-box">' +
            '<div class="name">' + id + '</div>' +
            '<div class="msg-frame ' + ((id == ID) ? 'my-msg' : '') + '"><span class="msg">' + msg + '</span></div>' +
            '</div>'
        );
    }
    var objDiv = document.getElementById(tagId);
    objDiv.scrollTop = objDiv.scrollHeight;
}

// POPUP = {

function popupCreateRoom(roomId) {
    if (typeof roomId === "undefined") roomId = "";
    let content = $('#modal-main-popup').find(".content-main-popup");
    content.html(
        "<div class='title'>إنشاء غرفة</div>" +
        "اسم الغرفة <input type='text' id='room-name-input' placeholder='اسم الغرفة'>" +
        "كلمه السر <input type='text' id='room-password-input' placeholder='كلمه السر'>" +
        "<button onclick='createRoom()'>انضم</button>" +
        "<div class='wrong-txt'></div>"
    );
    $('#modal-main-popup').show();
}

function popupJoinRoom(roomId) {
    if (typeof roomId === "undefined") roomId = "";
    let content = $('#modal-main-popup').find(".content-main-popup");
    content.html(
        "<div class='title'>انضم إلى الغرفة</div>" +
        "معرف الغرفة <input type='text' id='join-room-id-input' value='" + roomId + "' placeholder='معرف الغرفة'>" +
        "كلمه السر <input type='text' id='join-room-password-input' placeholder='كلمه السر'>" +
        "<button onclick='joinRoomLock()'>انضم</button>" +
        "<div class='wrong-txt'></div>"
    );
    $('#modal-main-popup').show();
}

function openFrame(classname, element) {
    $(".chat-frame").hide();
    $(".room-list-frame").hide();
    $(".member-list-frame").hide();
    $(".option-screen").hide();
    if (classname == "chat-frame") {
        $("." + classname).show();
    } else {
        $(".option-screen").css('display', 'flex');
        $("." + classname).css('display', 'flex');
    }
}

// } ENDPOPUP();
