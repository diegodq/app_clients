const formSignLogin = document.getElementById('sign_login');
const errorTextArea = document.getElementById('error-area')
const buttonSignIN = document.getElementById('sign_in')
const linkSignUpOption = document.getElementById('sign-up-option')
const linkForgotPassword = document.getElementById('link-forgot-password')
const spinner = document.getElementById('spinner-overlay')
const tokenCustomer = localStorage.getItem('tokenCustomer')
const iconShowPassword = document.getElementById('icon-eye-closed')
const iconHidePassword = document.getElementById('icon-eye-open')
const inputPassword = document.querySelector('input[name="password"]')
const modalConfirm = new bootstrap.Modal(document.getElementById('alertModal'), {
	keyboard: true
})

// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {

	if (tokenCustomer) {

		window.location.href = '/choice-product'

	}

})

// FAZENDO LOGIN
async function makingLogin(event) {

	// GERENCIANDO ANIMAÇÃO DO BOTÃO
	buttonSignIN.setAttribute('data-kt-indicator', 'on')
	buttonSignIN.disabled = true

	// PEGANDO DADOS DO FORMULÁRIO E ENVIANDO PRA API
	const formData = new FormData(formSignLogin)
	const dataCompany = Object.fromEntries(formData)

	fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/session' : configEnv.local_address + '/session', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(dataCompany),
	})
		.then(response => response.json())
		.then(data => {
			errorTextArea.innerText = ''

			setTimeout(() => {

				loginOptions(data.status, data.message, data.token, dataCompany.email)

			}, 1500)

		})
		.catch((error) => console.log(error))
}


function resendEmail(email) {
	
	spinner.classList.add('d-flex')
	const emailCustomer = { email: email }
	
	fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/resend-email' : configEnv.local_address + '/resend-email', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(emailCustomer)
	})
		.then(response => response.json())
		.then(data => {

			if (data.status === 'success') {

				setTimeout(() => {

					spinner.classList.remove('d-flex')
					modalConfirm.show()

					titleModalConfirm.innerText = `SUCESSO!`
					textModalConfirm.innerText = `A solicitação de reenvio de e-mail foi realizada com sucesso.`
					iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-success svg-icon-5hx "><svg
            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none">
            <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10"
                fill="black" />
            <path
                d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z"
                fill="black" />
            </svg>
            </span>`

				}, 500);

				setTimeout(() => {

					modalConfirm.hide()
					location.reload()

				}, 2000)


			} 

		})

}


// OPÇÕES DE LOGIN
function loginOptions(status, message, token, email) {

	if (message === 'Cliente inativado.') {
		function customerInactive() {
			setTimeout(() => {
				buttonSignIN.removeAttribute('data-kt-indicator', 'on');
				errorTextArea.innerText = `Conta inativa. É necessário fazer ativação através do link enviado ao e-mail cadastrado. Não recebeu o e-mail? `;
				const link = document.createElement('a')
				link.textContent = 'Clique aqui'
				link.classList.add('fw-bolder', 'cursor-pointer')
				link.addEventListener('click', function () {
					resendEmail(email)
				});

				errorTextArea.appendChild(link)
				buttonSignIN.disabled = false
			}, 600);
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