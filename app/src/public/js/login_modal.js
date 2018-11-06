$(document).ready(function(){
	$("#login_button").click(function(){
		$("#login_modal").modal();
	});
	$('#login_form').on('submit', function(event){
		event.preventDefault();
		if ($('#username_login').val() == '' || $('#pwd_login').val() == '')
		{
			$('#login_fail').html("<div class='alert alert-danger' data-alert> hop hop hop, manque des trucs la....</div>");
			return;
		}
		$.ajax({
			url : "/login",
			type : "POST",
			data: {
				'username': $('#username_login').val(),
				'password': $('#pwd_login').val()
			},
			success : function(json)
			{
				window.location = json.redirect;
			},
			error : function(xhr,errmsg,err) {
				   $('#login_fail').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
			}
		});
	});
});
