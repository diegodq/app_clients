// VALIDAÇÕES FORMULÁRIO DE USUÁRIO
$(document).ready(function () {
    $('#form-text-question-componente').validate({
        rules: {
            inputTextQuestion: {
                required: true,
            },
        },
        messages: {
            inputTextQuestion: {
                required: "Qual o texto da pergunta que deseja cadastrar?",
            },
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent())
            element.parent().addClass('error-label')

        },
        submitHandler: function (form) {

            event.preventDefault()

            componentTextToTree()


        },
        onfocusout: function (element) {
            this.element(element);
            $(element).valid();
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label')
            label.remove();
        }
    })
    $('#form-name-question-componente').validate({
        rules: {
            inputNameQuestion: {
                required: true,
            },
        },
        messages: {
            inputNameQuestion: {
                required: "Qual o nome da pergunta que deseja cadastrar?",
            },
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent())
            element.parent().addClass('error-label')

        },
        submitHandler: function (form) {

            event.preventDefault()

            componentNameToText()


        },
        onfocusout: function (element) {
            this.element(element);
            $(element).valid();
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label')
            label.remove();
        }
    })
    $('.input-checkbox-import').on('change', function () {
        var isChecked = $('.input-checkbox-import:checked').length > 0;

        if (isChecked) {

            buttonAdvanceImportQuestion.removeClass('disabled')

        } else {

            buttonAdvanceImportQuestion.addClass('disabled')

        }
    })
    $('#form-binary-question-componente').validate({
        rules: {
            inputBinary2: {
                required: true,
            },
            inputBinary1: {
                required: true,
            }
        },
        messages: {
            inputBinary2: {
                required: "Qual é a opção 01 de resposta?",
            },
            inputBinary1: {
                required: "Qual é a opção 02 de resposta?",
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent())
            element.parent().addClass('error-label')

        },
        submitHandler: function (form) {

            event.preventDefault()

            binaryCoponentToReview()


        },
        onfocusout: function (element) {
            this.element(element);
            $(element).valid();
        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label')
            label.remove();
        }
    })
    $('#form-anchor-question').validate({
        rules: {
            inputAnchorQuestion: {
                required: true
            },
        },
        messages: {
            inputAnchorQuestion: {
                required: function() {
                    var buttonText = buttonRegisterAnchorQuestion[0].textContent.trim()
               
                    if (buttonText === 'ALTERAR') {
                        return "Para qual novo texto de pergunta âncora que deseja alterar?";
                    } else {
                        return "Qual o texto para a pergunta âncora que deseja cadastrar?";
                    }
                }
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
            element.parent().addClass('error-label');
        },
        submitHandler: async function (form, event) {

            event.preventDefault();
            const inputValue = inputAnchorQuestion.val()
    
            await registerAnchorQuestion(inputValue)

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

// Adiciona regra CSS para estilizar as mensagens de erro em vermelho
$(document).ready(function () {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
})