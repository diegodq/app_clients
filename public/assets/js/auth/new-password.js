const iconShowPassword = document.getElementById('icon-eye-closed')
const iconHidePassword = document.getElementById('icon-eye-open')
const inputPassword = document.getElementById('password')
const spinner = document.getElementById('spinner-overlay')
const buttonSendPassword = document.getElementById('button-change-password-solicitation')
const tokenCustomer = localStorage.getItem('tokenCustomer')
const iconShowConfirmPassword = document.getElementById('icon-eye-closed2')
const iconHideConfirmPassword = document.getElementById('icon-eye-open2')
const inputConfirmPassword = document.querySelector('input[name="confirm_password"]')

// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {

	if (tokenCustomer) {

		window.location.href = '/choice-product'

	}

})

function togglePasswordVisibility(event) {
    if (inputPassword.type === 'password') {
        inputPassword.type = 'text';
        iconHidePassword.classList.add('d-none');
        iconShowPassword.classList.remove('d-none');
    } else {
        inputPassword.type = 'password';
        iconShowPassword.classList.add('d-none');
        iconHidePassword.classList.remove('d-none');
    }
}

iconHidePassword.addEventListener('click', togglePasswordVisibility);
iconShowPassword.addEventListener('click', togglePasswordVisibility);

function toggleConfirmPasswordVisibility(event) {

    if (inputConfirmPassword.type === 'password') {
        inputConfirmPassword.type = 'text';
        iconHideConfirmPassword.classList.add('d-none');
        iconShowConfirmPassword.classList.remove('d-none');
    } else {
        inputConfirmPassword.type = 'password';
        iconShowConfirmPassword.classList.add('d-none');
        iconHideConfirmPassword.classList.remove('d-none');
    }
}

iconShowConfirmPassword.addEventListener('click', toggleConfirmPasswordVisibility);
iconHideConfirmPassword.addEventListener('click', toggleConfirmPasswordVisibility);


async function makeNewPassword(event) {

    event.preventDefault()
    spinner.classList.add('d-flex')

    const params = new URLSearchParams(window.location.search)
    const customerData = { 'new_password': inputPassword.value, 'token': params.get('token'), 'id': params.get('id') }

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/customer/reset-password' : configEnv.local_address + '/customer/reset-password', {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify(customerData),

    }).then(response => response.json())
        .then(data => {
            
            setTimeout(() => {


                if (data.status === 'success') {
                    spinner.classList.remove('d-flex')
                    Swal.fire({
                        title: 'Bem-vindo de volta!',
                        text: 'Seu cadastro foi recuperado e agora você possui uma nova senha para entrar em nossa plataforma.',
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

                        }, 600)

                    })

                } else {
                    spinner.classList.remove('d-flex')
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Algo inesperado aconteceu e não foi possível alterar seus dados. Por favor, repita o processo de recuperação de senha.',
                        icon: 'error',
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

                        }, 600)

                    })

                }
            }, 600)


        }).catch((error) => console.log(error))
}

