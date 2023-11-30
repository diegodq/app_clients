// VALIDAÇÕES FORMULÁRIO DE USUÁRIO
$(document).ready(function () {
    $('#customer_form').validate({
        rules: {
            email: {
                required: true,
                email: true,
                emailWithDot: true
            },
            surname: {
                required: true,
            },
            position: {
                required: true
            },
            phone: {
                required: true
            },
            first_name: {
                required: true,
            },
            password: {
                required: true,
                passwordValidation: true
            },
            accept_terms: {
                required: true
            },
            confirm_password: {
                required: true,
                equalTo: "input[name='password']"
            }
        },
        messages: {
            email: {
                required: "O campo e-mail é obrigatório.",
                email: "O valor inserido não é um e-mail válido.",
                emailWithDot: "O valor inserido não é um e-mail válido."
            },
            surname: {
                required: "O campo Sobrenome é obrigatório.",
            },
            position: {
                required: "O campo Cargo / Profissão é obrigatório."
            },
            accept_terms: {
                required: "Você deve aceitar os termos para prosseguir."
            },
            phone: {
                required: "O campo Celular é obrigatório."
            },
            first_name: {
                required: "O campo Seu Nome é obrigatório.",
            },
            password: {
                required: "O campo Crie sua senha é obrigatório.",
                passwordValidation: "A senha inserida não atende aos requisitos mínimos."
            },
            confirm_password: {
                required: "O campo Confirme sua senha é obrigatório.",
                equalTo: "Os campos de senha não são iguais."
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
            
            event.preventDefault()
            // GERENCIANDO ANIMAÇÃO DO BOTÃO
            buttonSignUpCustomer.setAttribute('data-kt-indicator', 'on');
            buttonSignUpCustomer.disabled = true;
            // EXECUTANDO A FUNÇÃO DE REGISTRO
            await registerCustomer(event)


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
});

// Adiciona regra CSS para estilizar as mensagens de erro em vermelho
$(document).ready(function () {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
});

// MÁSCARAS DE INPUT

$(document).ready(function () {
    $('input[name="phone"]').mask('(00) 0 0000-0000');
});

// VALIDAÇÕES PERSONALIZADAS

$.validator.addMethod("emailWithDot", function (value, element) {
    return this.optional(element) || /\S+@\S+\.\S+/.test(value);
})

$.validator.addMethod("passwordValidation", function (value, element) {
    return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
})

$.validator.addMethod("lettersOnly", function(value, element) {
    return this.optional(element) || /^[a-zA-Z]+$/.test(value);
})

