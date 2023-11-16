
$(document).ready(function () {
    $('#form-binary-question-componente').validate({
        rules: {
            inputTextFinishResearch: {
                required: true,
            },
            inputButton1: {
                required: true,
            },
            inputButton2: {
                required: true,
            }
        },
        messages: {
            inputTextFinishResearch: {
                required: "Qual o texto de encerramento de pesquisa que deseja cadastrar?",
            },
            inputButton1: {
                required: "É obrigatória a inserção do texto para o Botão 01.",
            },
            inputButton2: {
                required: "É obrigatória a inserção do texto para o Botão 02.",
            },
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent())
            element.parent().addClass('error-label')
        },
        submitHandler: async function (form, event) {

            event.preventDefault()

            const dataQuestion = await getDataTools('radio_finish_survey', 'FINA. PESQUISA')

            await registerQuestion(dataQuestion)

        },
        success: function (label, element) {
            $(element).closest('.form-group').removeClass('error-label')
            label.remove();
        }
    });
})

$(document).ready(function () {
    $('#form-alert-tools-component').validate({
        rules: {
            inputTextAlert: {
                required: true,
            },
        },
        messages: {
            inputTextAlert: {
                required: "Qual o texto do alerta que deseja cadastrar?",
            },
        },
        errorPlacement: function (error, element) {
            error.appendTo($("#inputTextAlert-error"));
            element.parent().addClass('error-label');
        },
        submitHandler: function (form, event) {
           
            event.preventDefault()

            const dataQuestion = getDataTools('radio_alert_survey', 'ALERTA')

            registerQuestion(dataQuestion)


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
})