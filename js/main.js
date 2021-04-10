'use strict';


var localuser;
var isChannelReady;
var isInitiator = false;
var isStarted = false;
var pc;
var dataChannel;
var turnReady;

var pc_config = {
    'iceServers': [{
        'url': 'stun:stun.acrobits.cz:3478'
    }]
};


var pc_constraints = {
    'optional': [{
        'DtlsSrtpKeyAgreement': true
    }]
};


var sdpConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    }
};



var startButton = document.getElementById("startButton");
startButton.disabled = false;
startButton.onclick = createConnection;

const chatMessages = document.getElementById('chat');


var room = location.pathname.substring(1);
var user = location.pathname.substring(2);
var socket = io.connect();


function createConnection() {
    if (user === '') {
        user = document.getElementById("userId").value;
    }

    if (room === '') {
        room = document.getElementById("roomId").value;
    }


    if (user === '' || room === '') {
        alert('Ingrese usuario');
        return false;
    }
    $('.navbar-toggle').trigger('click');
    localuser = document.getElementById("userId").value;
    if (room !== '') {
        socket.emit('create or join', room);
    }
    $('#chat').append("<span style='color:#000032;padding-left: 5px;'>Bienvenido al chat</span> " + "</br>");
}

socket.on('chat', function(message) {
    console.log(message);
    $('#chat').append("<span style='color:black;padding-left: 5px; font-weight: bold;'>" + message.user + "</span>: " + message.msg + "</br>");
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

$('#msg').keypress(function(e) {


    if (e.keyCode === 13) {
        if (user === '') {
            alert('Primero ingrese a la sala general');
            return false;
        }
        if ($('#msg').val() === '')
            return false;
        var msg = $('#msg').val();
        var msgob = {
            'user': localuser,
            'msg': msg
        };
        socket.emit('chat', msgob);
        $('#chat').append("<span style='color:black;padding-left: 5px; font-weight: bold; '>Yo</span>: " + msgob.msg + "</br>");

        $('#msg').val('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

socket.on('created', function(room) {

    console.log('Sala creada' + room);
    isInitiator = true;

});

socket.on('full', function(room) {
    console.log('Sala' + room + " llena.");
});



socket.on('join', function(room) {
    console.log('Petición de otra persona ' + room);
    console.log('Esta persona inicio esta sala ' + room + '!');
    isChannelReady = true;
});

socket.on('joined', function(room) {

    console.log('Sala ' + room + ' Ingresó correctamente');
    isChannelReady = true;
});



function sendMessage(message) {
    socket.emit('message', message);
}