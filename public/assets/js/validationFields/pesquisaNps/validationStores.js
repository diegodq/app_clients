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
                required: "Qual o número de referência da loja?"
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
});


$(document).ready(function () {
    $('<style>.error-label label.error { color: red; }</style>').appendTo('head');
});

