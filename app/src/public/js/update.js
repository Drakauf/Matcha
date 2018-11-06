$( document ).ready(function() {
     $('#update_form_names').on('submit', function(event){
            event.preventDefault();
            var toto = document.getElementById('username_update').value;
        $.ajax({
            url : "/user/update/names",
            type : "POST", 
            data : {
                'login': $('#username_update').val(),
                'last_name': $('#last_name_update').val(),
                'first_name': $('#first_name_update').val(),
                'email': $('#email_update').val()
            },
            success : function(json) {
                $('#username_update').attr("placeholder", json.username);
                $('#username_update').val('');
                $('#last_name_update').attr("placeholder", json.last_name);    
                $('#last_name_update').val('');
                $('#first_name_update').attr("placeholder", json.first_name); 
                $('#first_name_update').val('');
                $('#email_update').attr("placeholder", json.email); 
                $('#email_update').val('');
                $('#result_update_form_names').html("<div class='alert alert-success' data-alert> Les modifications ont été enregistés !</div>");
            },
            error : function(xhr,errmsg,err) {
                $('#result_update_form_names').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    });
 });

$( document ).ready(function() {
     $('#update_form_address').on('submit', function(event){
            event.preventDefault();
            var toto = document.getElementById('number_address_update').value;
        $.ajax({
            url : "/user/update/address",
            type : "POST", 
            data : {
                'number_address': $('#number_address_update').val(),
                'street': $('#street_update').val(),
                'city': $('#city_update').val(),
                'zip': $('#zip_update').val(),
                'country': $('#country_update').val(),
                'complement': $('#complement_update').val(),
            },
            success : function(json) {
                $('#number_address_update').attr("placeholder", json.number_address);
                $('#number_address_update').val('');
                $('#street_update').attr("placeholder", json.street);
                $('#street_update').val('');
                $('#city_update').attr("placeholder", json.city);
                $('#city_update').val('');
                $('#zip_update').attr("placeholder", json.zip);
                $('#zip_update').val('');
                $('#country_update').attr("placeholder", json.country);
                $('#country_update').val('');
                $('#complement_update').attr("placeholder", json.complement);
                $('#complement_update').val('');
                $('div').remove('#suggestions');
                $('#result_update_form_address').html("<div class='alert alert-success' data-alert> Adresse mise à jour !</div>");
            },
            error : function(xhr,errmsg,err) {
                $('#result_update_form_address').html("<div class='alert alert-danger' data-alert>L'adresse semble incorrect, corrigez le formulaire à l'aide nos suggestions ci-dessous : </div>");
                $('#suggestions').html('<select name="nom" size="1" id="suggestion_options"></select>');
                for (var i = 0; i < 10 ; i++) { 
                    $('#suggestion_options').append("<option id='" + xhr.responseJSON.data[i] + "' >"+ xhr.responseJSON.data[i]+"</option>");
                }

            }
        });
    });
 });

$( document ).ready(function() {
     $('#update_form_password').on('submit', function(event){
            event.preventDefault();
            var toto = document.getElementById('password_update').value;
        $.ajax({
            url : "/user/update/password",
            type : "POST", 
            data : {
                'password': $('#password_update').val(),
                'new_password': $('#new_password_update').val(),
                'confirm_new_password': $('#confirm_new_password_update').val()
            },
            success : function(json) {
                $('#password_update').val('');
                $('#new_password_update').val('');
                $('#confirm_new_password_update').val('');
                $('#result_update_form_password').html("<div class='alert alert-success' data-alert> Mot de passe mit à jour !</div>");
            },
            error : function(xhr,errmsg,err) {
                $('#result_update_form_password').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    });
 });

$( document ).ready(function() {
     $('#update_form_lookingfor').on('submit', function(event){
            event.preventDefault();
            var toto = document.getElementById('age_less_update').value;
        $.ajax({
            url : "/user/update/lookingfor",
            type : "POST", 
            data : {
                'gender': $('.gender_update:checked').val(),
                'affinity_age_less': $('#age_less_update').val(),
                'affinity_age_more': $('#age_more_update').val(),
                'affinity': $('.affinity_update:checked').val(),

            },
            success : function(json) {  
                $('#age_less_update').attr("placeholder", json.affinity_age_less); 
                $('#age_less_update').val('');
                $('#age_more_update').attr("placeholder", json.affinity_age_more);
                $('#age_more_update').val('');
                $('.affinity_update').attr("checked", json.affinity);
                $('#result_update_form_lookingfor').html("<div class='alert alert-success' data-alert> Affinité mise à jour !</div>");
            },
            error : function(xhr,errmsg,err) {
                $('#result_update_form_lookingfor').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    });
 });

$( document ).ready(function() {
     $('#update_form_biography').on('submit', function(event){
            event.preventDefault();
            var toto = document.getElementById('biography_update').value;
        $.ajax({
            url : "/user/update/biography",
            type : "POST", 
            data : {
                'biography': $('#biography_update').val(),
            },
            success : function(json) {
                $('#biography_update').attr("placeholder", json.biography);
                $('#biography_update').val('');
                $('#result_update_form_biography').html("<div class='alert alert-success' data-alert> Biographie mise à jour !</div>");
            },
            error : function(xhr,errmsg,err) {
                $('#result_update_form_biography').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    });
 });

$( document ).ready(function() {
     $('#tags_form').on('submit', function(event){
            event.preventDefault();
            var toto = document.getElementById('new_tag').value;
        $.ajax({
            url : "/user/update/tags",
            type : "POST", 
            data : {
                'tag': $('#new_tag').val(),
            },
            success : function(json) {
                $('#new_tag').val('#');
                $('#tag').append('<div class="col-md-3" class="delete_tag" id="'+ json.index3 +'"><div class="tag_div"><p>' + toto + '\
                                        <button class="close" type="button" id="' + json.index2 + '">x</button></p></div></div>');
                 $('#result_error_tag').html('');
            },
            error : function(xhr,errmsg,err) {
                $('#result_error_tag').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    });
 });

$( document ).ready(function() {
     $('#tag').on('click', function(event){
            event.preventDefault();
        $.ajax({
            url : "/user/update/delete_tag2",
            type : "POST", 
            data : {
                'tag': event.target.id,
            },
            success : function(json) {
                $('div').remove(json.index);
                $('#result_error_tag').html("");
            },
            error : function(xhr,errmsg,err) {
                $('#result_error_tag').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
     });
 });

$( document ).ready(function() {
     $('.delete_tag').on('click', function(event){
            event.preventDefault();
        $.ajax({
            url : "/user/update/delete_tag",
            type : "POST", 
            data : {
                'tag': event.target.id,
            },
            success : function(json) {
                $('div').remove('#' + json.index);
                $('#result_error_tag').html("");
            },
            error : function(xhr,errmsg,err) {
                $('#result_error_tag').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    });
 });
