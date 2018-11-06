function photo_descri(nbr)
{
	$(".desc").css("background-color", "#FFFFFF");
	$(".desc").hover(function(){$(this).css("background-color", "#42A5F5");},function(){$(this).css("background-color", "#FFFFFF");});
	$(".profil_pic").css("background-color", "#FFFFFF");
	$(".profil_pic").hover(function(){$(this).css("background-color", "#42A5F5");},function(){$(this).css("background-color", "#FFFFFF");});
	$(".desc" + nbr).css("background-color", "#3EA055");
	$(".desc" + nbr).hover(function(){$(this).css("background-color", "#4CC417");},function(){$(this).css("background-color", "#3EA055");});
	$("#imgmodalmsg").html("<p> Cette photo est désormais ta photo description #"+ nbr +" :)</p>");
}

function photo_profil()
{
	$(".desc").css("background-color", "#FFFFFF");
	$(".desc").hover(function(){$(this).css("background-color", "#42A5F5");},function(){$(this).css("background-color", "#FFFFFF");});
	$(".profil_pic").css("background-color", "#3EA055");
	$(".profil_pic").hover(function(){$(this).css("background-color", "#4CC417");},function(){$(this).css("background-color", "#3EA055");});
	$("#imgmodalmsg").html("<p> Cette photo est désormais ta photo de profil :)</p>");
}

function modalshow(data)
{
	$(".desc").css("background-color", "#FFFFFF");
	$(".desc").hover(function(){$(this).css("background-color", "#42A5F5");},function(){$(this).css("background-color", "#FFFFFF");});
	if (data.is_profil == 1)
	{
		$(".profil_pic").css("background-color", "#3EA055");
		$(".profil_pic").hover(function(){$(this).css("background-color", "#4CC417");},function(){$(this).css("background-color", "#3EA055");});
	}
	if (data.is_descri != null && data.is_descri > 0 && data.is_descri < 5)
	{
		$(".desc"+data.is_descri).css("background-color", "#3EA055");
		$(".desc"+data.is_descri).hover(function(){$(this).css("background-color", "#4CC417");},function(){$(this).css("background-color", "#3EA055");});
	}
}

function makedescri(id_test, nbr)
{
	$.ajax({
		url: "/user/photos/descri",
		type: "POST",
		data: {
			'id_photo': id_test, 
			'nbr': nbr 
		},
		success : function(json)
		{
			photo_descri(nbr);
			$("#profil_picture").attr("src", json.src);
		},
		error : function(xhr, errmsg, err) {
		}	
	});
}



function delphoto(id_test)
{
	$.ajax({
		url: "/user/photos/delphoto",
		type: "POST",
		data: {
			'id_photo': id_test 
		},
		success : function(json)
		{
			$("#profil_picture").attr("src", json.src);
			$("#photos_modal").modal('hide');
			$("#" + id_test).hide();
		},
		error : function(xhr, errmsg, err) {
		}	
	});
}


function makeprofil(id_test)
{
	$.ajax({
		url: "/user/photos/profil",
		type: "POST",
		data: {
			'id_photo': id_test 
		},
		success : function(json)
		{
			$("#profil_picture").attr("src", json.src);
			photo_profil();
		},
		error : function(xhr, errmsg, err) {
		}	
	});
}

$(document).ready(function(){
	$(".all_images").on('click', function(event){
		event.stopPropagation();
		event.stopImmediatePropagation();
		$("#photos_modal").modal();
		$.ajax({
			url: "/user/photos/detail",
			type: "POST",
			data: {
				'id_photo': event.target.id 
			},
			success : function(json)
			{
				$("#photo_detail").html("<div id=imgmodalmsg></div><img class=modal_image src=" + json.src + "><button class='desc , profil_pic' onclick=makeprofil(" + event.target.id +") >Make it Profil Pic</button><button class='desc , desc1' onclick=makedescri(" + event.target.id + ",'1')>Pic Description 1</button><button class='desc , desc2' onclick=makedescri(" + event.target.id + ",'2')>Pic Description 2</button><button class='desc , desc3' onclick=makedescri(" + event.target.id + ",'3')>Pic Description 3</button><button class='desc , desc4' onclick=makedescri(" + event.target.id + ",'4')>Pic Description 4</button><button class=del onclick=delphoto(" + event.target.id + ")>Delete Pic</button>");
				modalshow(json);
			},
			error : function(xhr, errmsg, err){
				$("#photo_detail").html("<div> an error occured " + errmsg + "</div>");
			}	
		});
	});
});
