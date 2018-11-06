var err_profil = document.getElementById("err_profil");
var L;

$(document).ready(function(){
	var socket = io();
	var id_path = window.location.href.split("/")[4];
	socket.emit('to notif', id_path, "visited");
	if (id_path && L) {
		$.ajax({
            url : "/profil/geolocalisation",
            type : "POST",
            data : {
            	id : id_path
            },
            success : function(json) {
            	var popup = L.popup();
                var geolocationMap = L.map('mapholder', {
                    layers: MQ.mapLayer(),
                    center: [40.731701, -73.993411],
                    zoom: 10
                });

                popup.setLatLng([json.lat, json.lng]);
                var cityLatLngs = [
		        	[json.lat - 0.03, json.lng + 0.04],
		        	[json.lat - 0.03, json.lng - 0.04],
		        	[json.lat + 0.01, json.lng - 0.04],
		        	[json.lat + 0.01, json.lng + 0.04]
		        ];
				L.polygon(cityLatLngs, {color: 'blue'}).addTo(geolocationMap);
                geolocationMap.setView([json.lat, json.lng]);
        
            },
            error : function(xhr,errmsg,err) {
            }
        });
	}
	$("#match").on('click', function()
			{
				$.ajax({
					url: "/profil/match",
					type: "POST",
					data: {
						'id_matched': id_path
					},
					success : function(json)
					{
						if (json.success != "no")
						{
							socket.emit('to notif', id_path, "match");
							$("#match").hide();
							$("#unmatch").show();
						}
					},
					error : function(xhr, errmsg, err){
						$("#button_error").html("<div> an error occured " + errmsg + "</div>");
					}
				});
			});
	$("#unmatch").on('click', function()
			{
				$.ajax({
					url: "/profil/unmatch",
					type: "POST",
					data: {
						'id_matched': id_path
					},
					success : function(json)
					{
						if (json.success != "no")
						{
							socket.emit('to notif', id_path, "unmatch");
							$("#unmatch").hide();
							$("#match").show();
						}
					},
					error : function(xhr, errmsg, err){
						$("#button_error").html("<div> an error occured " + errmsg + "</div>");
					}
				});
			});

	$("#block").on('click', function()
			{
				$.ajax({
					url: "/profil/block",
					type: "POST",
					data: {
						'id_matched': id_path
					},
					success : function(json)
					{
						if (json.success != "no")
						{
							window.location.href = "/";
						}
					},
					error : function(xhr, errmsg, err){
						$("#button_error").html("<div> an error occured " + errmsg + "</div>");
					}
				});
			});

	$("#report").on('click', function()
			{
				$.ajax({
					url: "/profil/report",
					type: "POST",
					data: {
						'id_matched': id_path
					},
					success : function(json)
					{
						if (json.success != "no")
						{
							$("#report").hide();
							$("#block").css("margin-top", "5%");
						}
					},
					error : function(xhr, errmsg, err){
						$("#button_error").html("<div> an error occured " + errmsg + "</div>");
					}
				});
			});

	$("#message").on('click', function()
			{
				$.ajax({
					url: "/profil/message",
					type: "POST",
					data: {
						'id_matched': id_path
					},
					success : function(json)
					{
						if (json.success != "no")
						{
							socket.emit('to notif', id_path, "new_conversation");
							window.location.href= "/chat/conversation/" + json.chat_id;	
						}
					},
					error : function(xhr, errmsg, err){
						$("#button_error").html("<div> an error occured " + err+ "</div>");
					}
				});
			});

	$("#match").css("background-color", "rgb(244, 170, 170)");
	 $("#match").hover(function(){$(this).css("background-color", "#6eb764");},function(){$(this).css("background-color", "rgb(244, 170, 170)");});

	$("#unmatch").css("background-color", "#B71C1C");
	 $("#unmatch").hover(function(){$(this).css("background-color", "#EF5350");},function(){$(this).css("background-color", "#B71C1C");});

	$("#message").css("background-color", "#7BCC70");
	 $("#message").hover(function(){$(this).css("background-color", "#66BB6A");},function(){$(this).css("background-color", "#7BCC70");});

	$("#block").css("background-color", "#B71C1C");
	 $("#block").hover(function(){$(this).css("background-color", "#EF5350");},function(){$(this).css("background-color", "#B71C1C");});
	

	$("#report").css("background-color", "#E65100");
	 $("#report").hover(function(){$(this).css("background-color", "#FFA726");},function(){$(this).css("background-color", "#E65100");});
});
