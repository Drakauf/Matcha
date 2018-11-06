var id;
$(document).ready(function(){
	var socket = io();
	$.ajax({
				url: "/notifications/connection",
				type: "POST",
				success : function(json) {
					id = json.id;
					socket.emit('log', json.id);
				},

			});
	$.ajax({
				url: "/notifications",
				type: "POST",
				data: {
					'id' : id
				},
				success : function(json) {
					if (json.nb_notifs > 0) {
						$("#nbnotif").text(json.nb_notifs);
						$("#nbnotif").css('color', 'black');
						$("#nbnotif").css('background-color', 'red');
					}
					if (json.nb_notifs_chat > 0) {
						$("#nbnotif_chat").text(json.nb_notifs_chat);
						$("#nbnotif_chat").css('color', 'black');
						$("#nbnotif_chat").css('background-color', 'red');
					}
				},

			});
	socket.on('new notif', function(type)
	{
				var nb_notifs = $('#nbnotif').text();
				if (nb_notifs == "") 
					nb_notifs = 0;
				nb_notifs = parseInt(nb_notifs);
				nb_notifs += 1;
				$('#nbnotif').text(nb_notifs);
				$("#nbnotif").css('color', 'black');
				$("#nbnotif").css('background-color', 'red');
			});
	socket.on('new conversation', function(type, chat_id)
	{
				var path = window.location.pathname;
				if (path != '/chat/conversation/' + chat_id) {
					var nb_notifs_chat = $('#nbnotif_chat').text();
					if (nb_notifs_chat == "") 
						nb_notifs_chat = 0;
					nb_notifs_chat = parseInt(nb_notifs_chat);
					nb_notifs_chat += 1;
					$('#nbnotif_chat').text(nb_notifs_chat);
					$("#nbnotif_chat").css('color', 'black');
					$("#nbnotif_chat").css('background-color', 'red');
				}
			});
});
