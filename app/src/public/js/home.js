var L;

$( document ).ready(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            $.ajax({
                    url : "/geolocation",
                    type : "POST",
                    data : {
                        'latLng': latLng,
                    },
                    success : function(json) {
                
                    },
                    error : function(xhr,errmsg,err) {
                    }
                });
        })
    }
     $('#connected').on('click', function(event){
            event.preventDefault();
        var online = document.getElementById('connected').value;
        if (online == "Utilisateurs en ligne") { 
            $.ajax({
                url : "/home/connected",
                type : "POST",
                data : {
                    'online': online,
                },
                success : function(json) {
                    window.location = json.redirect;
                },
                error : function(xhr,errmsg,err) {
                }
            });
         }
         else {
            $.ajax({
                url : "/",
                type : "POST",
                data : {
                    'online': online,
                },
                success : function(json) {
                    window.location = json.redirect;
                },
                error : function(xhr,errmsg,err) {
                    //$('#result_error_tag').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
                }
            });

         }
     });
 });


$( document ).ready(function() {
    $('#more_filters').on('click', function(event){
        event.preventDefault();
        $.ajax({
                url : "/home/filters",
                type : "POST",
                data : {
                },
            success : function(json) {
                $('#connected').hide();
                $('#more_filters').hide();
                $('#filters').css("display", "block");
            },
            error : function(xhr,errmsg,err) {
            }
        });
    })
})

$( document ).ready(function() {
    $('#searching_bar').on('submit', function(event){
        event.preventDefault();
        $.ajax({
                url : "/home/search",
                type : "POST",
                data : {
                    'profil' : $('#search').val()
                },
            success : function(json) {
                window.location = json.redirect;
            },
            error : function(xhr,errmsg,err) {
                $('#result_error_search').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    })
})

$( document ).ready(function() {
    $('#filters').on('submit', function(event){
        event.preventDefault();
        if (($('#age_less_home').val() != '' || $('#age_more_home').val() != '') && ($('#age_less_home').val() == '' || $('#age_more_home').val() == '' )) {
               $('#result_error_home').html("<div class='alert alert-danger' data-alert>La tranche d'âge est incomplète</div>");
                return
        }
        if ($('#user_connected').is(':checked')) { var connected = "on";} else { var connected = "off"; }
        if ($('#popularity').is(':checked')) { var popularity = "on";} else { var popularity = "off"; }
        $.ajax({
                url : "/home/sort_by_filter",
                type : "POST",
                data : {
                    'age_less_home': $('#age_less_home').val(),
                    'age_more_home': $('#age_more_home').val(),
                    'km': $('#km').val(),
                    'connected': connected,
                    'popularity': popularity,
                    'common_tag': $('#common_tag').val()
                },
            success : function(json) {
                window.location = json.redirect;
            },
            error : function(xhr,errmsg,err) {
                $('#result_error_home').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    })
})



$(function() {
    $('#search').on('click', function(event){
        event.preventDefault();
    $.ajax({
                url : "/autocomplete",
                type : "POST",
                data : {
                },
            success : function(json) {
                 $('#search').autocomplete({ source : json.login_list })
            },
            error : function(xhr,errmsg,err) {
            }
        })
    });
});
