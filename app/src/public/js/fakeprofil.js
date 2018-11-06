var i;
i = 0;

function create(){
	setTimeout(function () { createprofil();
		i++;
		if (i < 501)
			create();
	}, 1500);
}
var j;
j = 0;

function createprofil() {
$.ajax({
	  url: 'https://randomuser.me/api/?nat=fr',
	  dataType: 'json',
	  success: function(res)
	  {
		  $.ajax({
			  url : "/faker",
			  type : "POST",
			  data : {
				  'user' : res.results[0]
			  },
			  success : function(json)
			  {
				  if (j == 0)
				  {
					  $("#Profils").append("<div id=first><p>Created Profils </p></div>");
					  $("#Profils").append("<div id=legend><div class=number><p>#</p></div><div class=bdid><p> id </p></div><div class=login><p>Login</p></div><div class=mdp> Mot de passe </div></div>");
				  }
					  $("#Profils").append("<div class=user><div class=number><p>" + j + "</p></div><div class=bdid><p>" + json.id  + "</p></div><div class=login> " + json.user.login.username + "</div><div class=login> " + json.user.login.password + "</div></div>");
				j++;
			  }
		  });
	  }
});
}
create();
