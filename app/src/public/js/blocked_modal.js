$(document).ready(function(){
	$("#blocked_button").click(function(event){
		$("#blocked_modal").modal();
	});
});

$(document).ready(function(){
	$(".unblock").click(function(event){
		event.preventDefault();
		$.ajax({
			url : "/user/update/unblock",
			type : "POST",
			data : {
                'login_unblock': event.target.id,
            },
			success : function(json) {
				$('div').remove("#" + event.target.id + "2");
			},
			error : function(xhr,errmsg,err) {
				   $('#blocked_form').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
			}
		});
	});
});

