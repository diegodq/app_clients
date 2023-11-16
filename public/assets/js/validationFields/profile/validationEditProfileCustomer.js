// VALIDAÇÕES FORMULÁRIO EDIÇÃO DE USUÁRIO
$(document).ready(function () {
    $('#edit-customer-form').validate({
        rules: {
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
        },
        messages: {
            surname: {
                required: "O campo Sobrenome é obrigatório.",
            },
            position: {
                required: "O campo Cargo / Profissão é obrigatório."
            },
            phone: {
                required: "O campo Celular é obrigatório."
            },
            first_name: {
                required: "O campo Seu Nome é obrigatório.",
            },
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent());
            element.parent().addClass('error-label');
        },
        submitHandler: function (form, event) {

            event.preventDefault();

            if ($(form).valid()) {
                editDataCustomer();
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

    $('#cancel-alter-data-customer').click(function (event) {
        event.preventDefault();
        discardChanges()
    });
})

// VALIDAÇÕES FORMULÁRIO EDIÇÃO DE EMPRESA
$(document).ready(function () {
    $('#edit-company-form').validate({
        rules: {
            fantasy_name: {
                required: true
            },
            zip_code: {
                required: true
            },
            number: {
                required: true
            },
        },
        messages: {
            fantasy_name: {
                required: "O campo Nome Fantasia é obrigatório."
            },
            zip_code: {
                required: "O campo CEP é obrigatório."
            },
            number: {
                required: "O campo número é obrigatório."
            }
        },
        errorPlacement: function(error, element) {
            
            error.appendTo(element.parent());
            element.parent().addClass('error-label');
          },
          submitHandler: function(form, event) {
        
            event.preventDefault()

           
            if ($(form).valid()) {
                editDataCompany()
            }
            
          },
          onfocusout: function(element) {
            this.element(element);
            $(element).valid();
          },
          success: function(label, element) {
            $(element).closest('.form-group').removeClass('error-label');
            label.remove();
          }
        });

    $('#cancel-alter-data-company').click(function (event) {
        event.preventDefault()
        discardChanges();
    });
})

// VALIDAÇÃO DE TROCA DE E-MAIL
$(document).ready(function () {
    $('#kt_signin_change_email').validate({
        rules: {
            emailaddress: {
                required: true,
                email: true,
                emailWithDot: true
            },
            confirmemailpassword: {
                required: true
            }
        },
        messages: {
            emailaddress: {
                required: "O campo e-mail é obrigatório.",
                email: "O valor inserido não é um e-mail válido.",
                emailWithDot: "O valor inserido não é um e-mail válido."
            },
            confirmemailpassword: {
                required: 'O campo senha é obrigatório.'
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "password") {
                error.appendTo(".password-error-label")
                $(".password-error-label").addClass("error-label")
            } else {
                error.appendTo(element.parent());
                element.parent().addClass('error-label')
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault()
            // EXECUTANDO A FUNÇÃO DE ALTERAÇÃO DE REGISTRO
            emailChange()
        },
        onfocusout: function (element) {
            this.element(element)
            $(element).valid()
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label');
            label.remove()
        }
    });
})

// VALIDAÇÃO DE TROCA DE SENHA
$(document).ready(function () {
    $('#kt_signin_change_password').validate({
        rules: {
            current_password: {
                required: true,
            },
            new_password: {
                required: true,
                passwordValidation: true
            },
            confirm_password: {
                required: true,
                equalTo: "input[name='new_password']"
            }
        },
        messages: {
            current_password: {
                required: "O campo Senha atual é obrigatório.",
            },
            new_password: {
                required: "O campo Nova senha é obrigatório.",
                passwordValidation: "A senha inserida não atende aos requisitos mínimos."
            },
            confirm_password: {
                required: "O campo Confirme sua senha é obrigatório.",
                equalTo: "Os campos de nova senha e confirmação de senha não iguais."
            },
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "password") {
                error.appendTo(".password-error-label");
                $(".password-error-label").addClass("error-label")
            } else {
                error.appendTo(element.parent());
                element.parent().addClass('error-label')
            }
        },
        submitHandler: function (form) {

            event.preventDefault()
            // EXECUTANDO A FUNÇÃO DE REGISTRO
            passwordChange()
        },
        onfocusout: function (element) {
            this.element(element)
            $(element).valid()
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label');
            label.remove()
        }
    })
})

// VALIDAÇÃO E-MAIL, SENHA E CHECKBOX EXCLUIR CONTA

$(document).ready(function () {
    $('#form-account-delete').validate({
        rules: {
            emailCancelAccount: {
                required: true,
                email: true,
                emailWithDot: true
            },
            passCancelAccount: {
                required: true
            }
        },
        messages: {
            emailCancelAccount: {
                required: "O campo e-mail é obrigatório.",
                email: "O valor inserido não é um e-mail válido.",
                emailWithDot: "O valor inserido não é um e-mail válido."
            },
            passCancelAccount: {
                required: 'O campo senha é obrigatório.'
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent());
            element.parent().addClass('error-label')
        },
        submitHandler: function (form) {
            // INSERIR AQUI A AÇÃO DE EXCLUIR CONTA
            deleteAccount()
        },
        onfocusout: function (element) {
            this.element(element)
            $(element).valid()
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label');
            label.remove()
        }
    });
})

$(document).ready(function () {
    $('#button-call-delete-account').click(function () {
        if ($('#deactivate').is(':checked')) {

            formDeleteAccount.addEventListener('submit', (event) => {
                event.preventDefault()
            })

            $('#error-message-checkbox-delete-account').text('').css('color', 'red')

            modalDeleteAccount.show()
            emailFieldModalCancelAccount.value = ''
            passFieldModalCancelAccount.value = ''
            fieldErrorDeleteAccount.value = ''

        } else {

            formDeleteAccount.addEventListener('submit', (event) => {
                event.preventDefault()
            })

            $('#error-message-checkbox-delete-account').text('Você deve confirmar a exclusão para prosseguir. ').css('color', 'red')

        }

    })
})

// CONSULTA CEP ALTERAÇÃO DE CADASTRO

const inputZIPCode = document.querySelector('[name="zip_code"]')
const errorZipCodeField = document.getElementById('error-zipcode-field')
if (inputZIPCode) {
    inputZIPCode.addEventListener('focusout', function (event) {
        const companyZIPCode = inputZIPCode.value.replace(/\D/g, '')

        fetch(`https://viacep.com.br/ws/${companyZIPCode}/json/`).then(
            (response) =>
                response.json().then((data) => {
                    if (data.erro) {

                        errorZipCodeField.innerText = 'O CEP não existe, ou o serviço está indisponível. Tente novamente.'

                    } else {
                        errorZipCodeField.innerText = ''
                        formStateCompany.value = data.uf
                        formAddressCompany.value = data.logradouro;
                        formDistricCompany.value = data.bairro;
                        formCityCompany.value = data.localidade;

                    }
                }),
        )
            .catch((error) => console.log(error));
    });
}

// Adiciona regra CSS para estilizar as mensagens de erro em vermelho
$(document).ready(function () {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head')
});

// MÁSCARAS DE INPUT
$(document).ready(function () {
    $('input[name="phone"]').mask('(00) 0 0000-0000')
})

$(document).ready(function () {
    $('input[name="cnpj"]').mask('00.000.000/0000-00')
})

$(document).ready(function () {
    $('input[name="zip_code"]').mask('00.000-000')

})


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