$(document).ready(function () {

    $('#sign_login').validate({
        rules: {
            email: {
                required: true,
                emailWithDot: true
            },
            password: {
                required: true,
            }
        },
        messages: {
            email: {
                required: "O campo e-mail é obrigatório.",
                emailWithDot: "O valor inserido não é um e-mail válido."
            },
            password: {
                required: "O campo senha está vazio.",
            }
        },
        errorPlacement: function (error, element) {
                error.appendTo(element.parent())
                element.parent().addClass('error-label')
        },
        submitHandler: async function (form, event) {
           
            event.preventDefault()

            await makingLogin(event)

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

$.validator.addMethod("emailWithDot", function (value, element) {
    return this.optional(element) || /\S+@\S+\.\S+/.test(value);
})