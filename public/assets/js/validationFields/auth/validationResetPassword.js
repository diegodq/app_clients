// VALIDAÇÃO RESET DE SENHA

$(document).ready(function () {
    $('#form-password-reset').validate({
        rules: {
            email: {
                required: true,
                email: true,
                emailWithDot: true
            }
        },
        messages: {
            email: {
                required: "O campo e-mail é obrigatório.",
                email: "O valor inserido não é um e-mail válido.",
                emailWithDot: "O valor inserido não é um e-mail válido."
            }
        },
        errorPlacement: function (error, element) {
                error.appendTo(element.parent())
                element.parent().addClass('error-label')
        },
        submitHandler: async function (form, event) {
           
            await resetPassword(event)

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

 // Adiciona regra CSS para estilizar as mensagens de erro em vermelho
 $(document).ready(function() {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
  })

$.validator.addMethod("emailWithDot", function (value, element) {
    return this.optional(element) || /\S+@\S+\.\S+/.test(value);
})