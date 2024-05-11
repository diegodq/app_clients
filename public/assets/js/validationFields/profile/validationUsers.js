// VALIDAÇÕES FORMULÁRIO EDIÇÃO DE USUÁRIO
$(document).ready(function () {
    $('#newUserForm').validate({
        rules: {
            surname: {
                required: true,
            },
            position: {
                required: true
            },
            first_name: {
                required: true,
            },
            email: {
                required: true,
                email: true,
                emailWithDot: true
            },
            password: {
                required: true,
            },
            confirm_password: {
                required: true,
                equalTo: "input[name='password']"
            },
            role_id: {
                required: true
            }
        },
        messages: {
            surname: {
                required: "O campo sobrenome é obrigatório.",
            },
            position: {
                required: "O campo função é obrigatório."
            },
            first_name: {
                required: "O campo nome é obrigatório.",
            },
            email: {
                required: "O campo email é obrigatório.",
                email: "O valor inserido não é um e-mail válido.",
                emailWithDot: "O valor inserido não é um e-mail válido."
            },
            password: {
                required: "O campo senha é obrigatório.",
            },
            confirm_password: {
                required: "O campo confirmar senha é obrigatório.",
                equalTo: "Os campos de senha não são iguais."
            },
            role_id: {
                required: "Selecione o perfil de usuário."
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "password") {

                error.appendTo(".password-error-label");
                $(".password-error-label").addClass("error-label");

            } else if (element.attr("name") == "confirm_password") {

                error.appendTo(".confirm-password-error-label");
                $(".confirm-password-error-label").addClass("error-label");


            } else {

                error.appendTo(element.parent());
                element.parent().addClass('error-label');

            }
        },
        submitHandler: async function (form, event) {

            event.preventDefault();

            if ($(form).valid()) {

                const dataCustomer = await getDataRegisterNewUser()

                console.log(dataCustomer)

                registerNewUser(dataCustomer)

            }
        },
        onfocusout: function (element) {
            this.element(element);
            $(element).valid();
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label');
            label.remove();
        }
    });
})

$(document).ready(function () {
    $('#editUserForm').validate({
        rules: {
            surname: {
                required: true,
            },
            position: {
                required: true
            },
            first_name: {
                required: true,
            },
            role_id: {
                required: true
            }
        },
        messages: {
            surname: {
                required: "O campo sobrenome é obrigatório.",
            },
            position: {
                required: "O campo função é obrigatório."
            },
            first_name: {
                required: "O campo nome é obrigatório.",
            },
            role_id: {
                required: "Selecione o perfil de usuário."
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent());
            element.parent().addClass('error-label');


        },
        submitHandler: async function (form, event) {

            event.preventDefault();

            if ($(form).valid()) {

                const dataForm = await getDataForUpdateCustomer()
                console.log(dataForm)
                updateUser(JSON.stringify(dataForm))

            }
        },
        onfocusout: function (element) {
            this.element(element);
            $(element).valid();
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label');
            label.remove();
        }
    });
})


// ESTILIZANDO MENSAGEM DE ERRO
$(document).ready(function () {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
});

$.validator.addMethod("emailWithDot", function (value, element) {
    return this.optional(element) || /\S+@\S+\.\S+/.test(value);
})