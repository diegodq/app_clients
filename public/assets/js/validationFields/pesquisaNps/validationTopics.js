// VALIDAÇÕES FORMULÁRIO DE USUÁRIO
$(document).ready(function () {
    $('#topics-form').validate({
        rules: {
            name: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Qual o nome do tópico que deseja cadastrar?",
            },
        },
        errorPlacement: function (error, element) {
                error.appendTo(element.parent())
                element.parent().addClass('error-label')
            
        },
        submitHandler: function(form, event) {

            event.preventDefault()
        
            let isInputChanged = false
        
            if ($(inputTopicName).val() !== idInputClickedToExport[0]) {
              isInputChanged = true
            }
        
            if (isInputChanged) {
              if (spanButtonRegisterTopic.textContent === 'ALTERAR') {
                modalRegisterTopic.hide()
                updateTopic();
                inputHiddenID.value = ''
              } else {
                modalRegisterTopic.hide()
                registerTopic();
                inputHiddenID.value = ''
              }
            } else {
                modalRegisterTopic.hide()
                
                spinner.classList.add('d-flex')
                setTimeout(() => {

                spinner.classList.remove('d-flex')
        
                location.reload()

                }, 500)
                
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
});

// Adiciona regra CSS para estilizar as mensagens de erro em vermelho
$(document).ready(function () {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
});

// VALIDAÇÕES PERSONALIZADAS

$.validator.addMethod("lettersNumbersSpacesOnly", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9\s]+$/.test(value);
  });
  