
const signLogin = document.getElementById('sign_login');
const errorTextArea = document.getElementById('error-area')
const buttonSignIN = document.getElementById('sign_in')
const linkSignUpOption = document.getElementById('sign-up-option')
const linkForgotPassword = document.getElementById('link-forgot-password')
const spinner = document.getElementById('spinner-overlay')
const tokenCustomer = localStorage.getItem('tokenCustomer')
const iconShowPassword = document.getElementById('icon-eye-closed')
const iconHidePassword = document.getElementById('icon-eye-open')
const inputPassword = document.querySelector('input[name="password"]')

// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {

	if (tokenCustomer) {

		window.location.href = '/choice-product'

	}

})

// FAZENDO LOGIN
function makingLogin() {

	// GERENCIANDO ANIMAÇÃO DO BOTÃO
	buttonSignIN.setAttribute('data-kt-indicator', 'on')
	buttonSignIN.disabled = true

	// SUSPENDENDO REQUISIÇÕES INDESEJADAS
	signLogin.addEventListener('submit', event => {
		event.preventDefault();
	})

	// PEGANDO DADOS DO FORMULÁRIO E ENVIANDO PRA API
	const formData = new FormData(signLogin);
	const dataCompany = JSON.stringify(Object.fromEntries(formData));

	fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/session' : configEnv.local_address + '/session', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: dataCompany,
	})
		.then(response => response.json())
		.then(data => {
			errorTextArea.innerText = ''

			setTimeout(() => {

				loginOptions(data.status, data.message, data.token)

			}, 1500)

		})
		.catch((error) => console.log(error))
}

// OPÇÕES DE LOGIN
function loginOptions(status, message, token) {

	if (message === 'Cliente inativado.') {
		function customerInactive() {
			setTimeout(() => {
				buttonSignIN.removeAttribute('data-kt-indicator', 'on')
				errorTextArea.innerText = `Conta inativa. É necessário fazer ativação através do link enviado ao e-mail cadatrado.`
				buttonSignIN.disabled = false
			}, 600)
		}
		return customerInactive()
	}

	if (message === 'Email ou Senha incorretos.' || message === 'Cliente não encontrado.') {
		function emailOrPassWrong() {
			setTimeout(() => {
				buttonSignIN.removeAttribute('data-kt-indicator', 'on')
				errorTextArea.innerText = `E-mail ou senha incorreta. Tente novamente ou recupere sua senha clicando em "Esqueceu sua senha?".`
				buttonSignIN.disabled = false
			}, 600)
		}
		return emailOrPassWrong()
	}

	if (status === 'no-company') {
		function finishRegistration() {
			buttonSignIN.removeAttribute('data-kt-indicator', 'on')
			buttonSignIN.disabled = false
			Swal.fire({
				title: 'Bem-vindo!',
				text: 'Identificamos que você ainda não concluiu seu cadastro. Por isso, iremos te encaminhar para que insira os dados que ainda estão pendentes.',
				icon: 'warning',
				confirmButtonColor: '#F05742',
				confirmButtonText: 'OK',
				customClass: {
					confirmButton: 'btn btn-primary-confirm',
				}
			}).then((result) => {

				localStorage.setItem('tokenCustomer', token)

				spinner.classList.add('d-flex')

				setTimeout(() => {

					spinner.classList.remove('d-flex')
					window.location.href = '/sign-up-company'

				}, 600)
			})
		}
		return finishRegistration()

	}

	if (token) {

		function loginSuccess() {
			buttonSignIN.removeAttribute('data-kt-indicator', 'on')
			buttonSignIN.disabled = false
			localStorage.setItem('tokenCustomer', token)
			window.location.href = '/dashboard'
		}
		return loginSuccess()

	}

}

// NAVEGAÇÃO CADASTRO / LOGIN

linkSignUpOption.addEventListener('click', (event) => {

	spinner.classList.add('d-flex')

	setTimeout(() => {

		spinner.classList.remove('d-flex')
		window.location.href = '/sign-up-customer'

	}, 500)

})

linkForgotPassword.addEventListener('click', (event) => {

	spinner.classList.add('d-flex')

	setTimeout(() => {

		spinner.classList.remove('d-flex')
		window.location.href = '/password-reset'

	}, 500)

})

// INTERAÇÃO COM O BOTÃO DE VISUALIZAR SENHA

iconHidePassword.addEventListener('click', (event) => {
    inputPassword.type = 'text'
    iconHidePassword.classList.add('d-none')
    iconShowPassword.classList.remove('d-none')
})

iconShowPassword.addEventListener('click', (event) => {
    inputPassword.type = 'password'
    iconShowPassword.classList.add('d-none')
    iconHidePassword.classList.remove('d-none')

})