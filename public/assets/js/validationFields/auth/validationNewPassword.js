$(document).ready(function () {
    $('#form-new-password-solicitation').validate({
        rules: {
            password: {
                required: true,
                passwordValidation: true
            },
            confirm_password: {
                required: true,
                equalTo: "input[name='password']"
            }
        },
        messages: {
            password: {
                required: "O campo nova senha é obrigatório.",
                passwordValidation: "A senha inserida não atende aos requisitos mínimos."
            },
            confirm_password: {
                required: "O campo confirme nova senha é obrigatório.",
                equalTo: "Os campos de senha não iguais."
            },
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "password" || element.attr("name") == "confirm_password") {
                error.appendTo(".password-error-label");
                $(".password-error-label").addClass("error-label");
            } else {
                error.appendTo(element.parent());
                element.parent().addClass('error-label');
            }
        },
        submitHandler: async function (form, event) {
         
            await makeNewPassword(event)
        },
        onfocusout: function (element) {
            this.element(element);
            $(element).valid();
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label');
            label.remove();
        }
    })
})

// ESTILIZANDO MENSAGEM DE ERRO
$(document).ready(function () {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
});

// VALIDAÇÕES PERSONALIZADAS
$.validator.addMethod("passwordValidation", function (value, element) {
    return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
})