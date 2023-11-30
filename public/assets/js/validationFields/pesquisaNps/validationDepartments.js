
$(document).ready(function () {
    $('#departments-form').validate({
        rules: {
            name: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Qual o nome de departamento que deseja cadastrar?",
            },
        },
        errorPlacement: function (error, element) {
                error.appendTo(element.parent())
                element.parent().addClass('error-label')
            
        },
        submitHandler: function (form) {

            event.preventDefault()
            
            if (spanbuttonRegisterDepartment.textContent === 'ALTERAR') {

                modalRegisterDepartment.hide()
                updateDepartment()
                inputHiddenID.value = ''
            
            
              } else {
            
                modalRegisterDepartment.hide()
                registerDepartment()
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

// VALIDAÇÕES PERSONALIZADAS

$.validator.addMethod("lettersNumbersSpacesOnly", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9\s]+$/.test(value);
  });
  

