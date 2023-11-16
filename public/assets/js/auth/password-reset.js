const spinner = document.getElementById('spinner-overlay')
const buttonCancelResetPass = document.getElementById('button-cancel-reset-password')
const inputEmail = document.querySelector('[name="email"]')
const passResetForm = document.getElementById('form-password-reset')
const tokenCustomer = localStorage.getItem('tokenCustomer')

// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {

	if (tokenCustomer) {
		window.location.href = '/choice-product'
	}

})


async function resetPassword(event) {
    event.preventDefault()

    spinner.classList.add('d-flex')

    const emailCustomer = { 'email': inputEmail.value }

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/forgot-password' : configEnv.local_address + '/forgot-password', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(emailCustomer),
    }).then(response => response.json())
        .then(data => {

            setTimeout(() => {
                spinner.classList.remove('d-flex')
                Swal.fire({
                    title: 'Enviado!',
                    text: 'Caso este endereço tenha cadastro em nossa plataforma,  um e-mail será enviado contendo as instruções para alterar sua senha. Vamos te redirecionar para o área de login.',
                    icon: 'success',
                    confirmButtonColor: '#F05742',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-primary-confirm',
                    }
                }).then((result) => {

                    spinner.classList.add('d-flex')

                    setTimeout(() => {

                        spinner.classList.remove('d-flex')
                        window.location.href = '/'

                    }, 250)

                })
            }, 500)
        })

}

buttonCancelResetPass.addEventListener('click', (event) => {

    event.preventDefault()

    spinner.classList.add('d-flex')

    setTimeout(() => {

        spinner.classList.remove('d-flex')
        window.location.href = '/'

    }, 500)

})


