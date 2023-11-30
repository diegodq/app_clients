$(document).ready(function () {
    $('#stores-form').validate({
        rules: {
            name: {
                required: true,
            },
            address: {
                required: true,
            },
            number: {
                required: true,
                notAllZeros: true // Adiciona a regra personalizada notAllZeros
            }
        },
        messages: {
            name: {
                required: "Qual o nome da loja que deseja cadastrar?",
            },
            address: {
                required: "Qual a localidade da loja que deseja cadastrar?"
            },
            number: {
                required: "Qual o número de referência da loja?",
                notAllZeros: "Não é permitido cadastrar loja de número zero. Insira outro número!"
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element)
            element.addClass('error-label')
        },
        submitHandler: async function (form, event) {
            event.preventDefault()

            if (spanbuttonRegisterStore.textContent === 'ALTERAR') {
                modalRegisterStore.hide()
                updateStore()
                inputHiddenID.value = ''
            } else {
                modalRegisterStore.hide()
                registerStore()
                inputHiddenID.value = ''
            }
        },
        onfocusout: function (element) {
            this.element(element);
            $(element).valid();
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label')
            label.remove();
        }
    });

    // Adiciona um estilo para a mensagem de erro ficar em vermelho
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
    
    // Adiciona o método de validação personalizado para garantir que o campo number não contenha apenas zeros
    $.validator.addMethod("notAllZeros", function(value, element) {
        return value.trim().replace(/^0*/, '').length > 0;
    }, "O número não pode conter somente zeros.");
});