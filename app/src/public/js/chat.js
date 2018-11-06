var path = window.location.pathname;
var room = path.replace("/chat/conversation/", "");
var err = 0;

$( document ).ready(function() {
    $('.conversation').on('click', function(event){
        event.preventDefault();
        $.ajax({
                url : "/chat/conversation/" + event.target.id,
                type : "POST",
                data : {
                	'id' : event.target.id
                },
            success : function(json) {
            	window.location = json.redirect;
            },
            error : function(xhr,errmsg,err) {
            }
        });
    })
})

$( document ).ready(function() {
    $('.blocked_conversation').on('click', function(event){
        event.preventDefault();
        $.ajax({
                url : "/chat/blocked_conversation",
                type : "POST",
                data : {
                	'id' : event.target.id
                },
            success : function(json) {
            	$('#blocked_conversation').html("<div class='alert alert-danger' data-alert>Cet utilisateur a essayé de comuniquer avec vous puis vous a bloqué</div>")
            },
            error : function(xhr,errmsg,err) {
            }
        });
    })
})

$(function () {
			var socket = io();
			socket.on('private message', function(msg, login){
				$('#messages').append($('<p class="col-md-3">').text(login));
				$('#messages').append($('<p class="col-md-9">'));
				$('#messages').append($('<p class="col-md-1">'));
				$('#messages').append($('<p class="col-md-5" id="msg" style="background-color:#f5c12d;">').text(msg));
				$('#messages').append($('<p class="col-md-1">'));
				window.scrollTo(0, document.body.scrollHeight);
			});
			socket.emit('conversation', room);
			$('form').submit(function(){
				if ( $('#m').val() == '') 
					return;
				if ($('#m').val().length > 255) {
					$('#err_chat').show();
					$('#err_chat').html("<div class='alert alert-danger' data-alert> Vous ne pouvez pas envoyer un message de plus de 255 caractères \
						Vous en êtes à " + $('#m').val().length + " caractères</div>");
					err = 1;
				}
				else {
					err = 0;
					$('#err_chat').hide();
				}
				if (err == 0) {
					$.ajax({
						url: "/chat/history",
						type: "POST",
						data: {
							'message' : $('#m').val(),
							'login' : $('#login').html(),
							'id_sender': $('#id_user_chat').html(),
							'id_chat' : room
						},
						success : function(json) {
							$('#messages').append($('<p class="col-md-9">'));
							$('#messages').append($('<p class="col-md-3>').text(json.sender_login));
							$('#messages').append($('<p class="col-md-6">'));
							$('#messages').append($('<p class="col-md-5" id="msg" style="background-color:#d8d8d8;">').text(json.sender_msg));
							$('#messages').append($('<p class="col-md-1">'));
							socket.emit('send message', room, $('#m').val(), $('#login').html());
							$('#m').val('');
							$.ajax({
								url: "/notifications/chat",
								type: "POST",
								data : {
									'id_chat' : room
								},
								success : function(json) {
									id_receiver = json.id_receiver;
									socket.emit('to notif', id_receiver, 'new_conversation', room);
								},

							});

	            		},
					})
				}
				return false;
			});
		});

