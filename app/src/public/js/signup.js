 $( document ).ready(function() {
     $('#signup_form').on('submit', function(event){
            event.preventDefault();
            var toto = document.getElementById('birth_date').value;
            if ($('#username_register').val() == '' || $('#last_name').val() == '' || $('#first_name').val() == '' || $('#pwd_register').val() == '' ||
            $('#confirm_pwd').val() == '' || $('#email').val() == '' || $('#birth_date').val() == '') {
            $('#result_signup').html("<div class='alert alert-danger' data-alert> Veuillez remplir tous les champs du formulaire </div>");
            return
         }
        $.ajax({
            url : "/signup",
            type : "POST", 
            data : {
                'username': $('#username_register').val(),
                'last_name': $('#last_name').val(),
                'first_name': $('#first_name').val(),
                'birth_date': $('#birth_date').val(),
                'pwd': $('#pwd_register').val(),
                'confirm_pwd': $('#confirm_pwd').val(),
                'email': $('#email').val()
            },
            success : function(json) {
                $('#username_register').val('');
                $('#last_name').val('');
                $('#first_name').val('');
                $('#birth_date').val('');
                $('#pwd_register').val('');
                $('#confirm_pwd').val('');
                $('#email').val('');
                $('#result_signup').html("<div class='alert alert-success' data-alert> Un email de confirmation vient de vous être envoyé </div>");
            },
            error : function(xhr,errmsg,err) {
                $('#result_signup').html("<div class='alert alert-danger' data-alert>"+xhr.responseText+"</div>");
            }
        });
    });
 });
