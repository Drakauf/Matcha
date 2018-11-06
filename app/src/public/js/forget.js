$(document).ready(function(){
	$('#get_mail').on('submit', function(event){
		event.preventDefault();
		if ($('#login').val() == '' || $('#mail').val() == '')
		{
			$('#mailsend').html("<div class='alert alert-danger' data-alert> hop hop hop, manque des trucs la....</div>");
			return;
		}
		else
		{
			$.ajax({
				url : "/login/forget/mail",
				type : "POST",
				data: {
					'login': $('#login').val(),
					'mail': $('#mail').val()
				},
				success : function(json)
				{
					$('#mailsend').html("<div class='alert alert-success' data-alert>"+ json.txt +"</div>");
				},
				error : function(xhr,errmsg,err) {
					$('#mailsend').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
				}
			});
		}
	});

	$('#set_pwd').on('submit', function(event){
		event.preventDefault();
		if ($('#new_pwdlogin').val() == '' || $('#key').val() == '' || $('#new_pwd').val() == '' || $('#confirm_newpwd').val() == '')
		{
			$('#redefine').html("<div class='alert alert-danger' data-alert> hop hop hop, manque des trucs la....</div>");
			return;
		}
		else
		{
			$.ajax({
				url : "/login/forget/set",
				type : "POST",
				data: {
					'login': $('#new_pwdlogin').val(),
					'key': $('#key').val(),
					'new_pwd': $('#new_pwd').val(),
					'confirm_pwd': $('#confirm_newpwd').val()
				},
				success : function(json)
				{
					$('#redefine').html("<div class='alert alert-success' data-alert>"+ json.txt +"</div>");
				},
				error : function(xhr,errmsg,err) {
					$('#redefine').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
				}
			});
		}
	});

	$('#relogin').on('submit', function(event){
		event.preventDefault();
		if ($('#login_newlogin').val() == '' || $('#login_newpwd').val() == '')
		{
			$('#login_error').html("<div class='alert alert-danger' data-alert> hop hop hop, manque des trucs la....</div>");
			return;
		}
		$.ajax({
			url : "/login",
			type : "POST",
			data: {
				'username': $('#login_new').val(),
				'password': $('#login_newpwd').val()
			},
			success : function(json)
			{
				window.location = json.redirect;
			},
			error : function(xhr,errmsg,err) {
				$('#login_error').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
			}
		});
	});

});
