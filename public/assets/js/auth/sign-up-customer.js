const buttonSignUpCustomer = document.getElementById('button_sign_up_customer')
const errorTextArea = document.getElementById('error-area')
const formCustomer = document.getElementById('customer_form')
const iconShowPassword = document.getElementById('icon-eye-closed')
const iconHidePassword = document.getElementById('icon-eye-open')
const inputPassword = document.getElementById('password')
const linkMakeLogin = document.getElementById('link-make-login')
const iconShowConfirmPassword = document.getElementById('icon-eye-closed2')
const iconHideConfirmPassword = document.getElementById('icon-eye-open2')
const inputConfirmPassword = document.querySelector('input[name="confirm_password"]')
const spinner = document.getElementById('spinner-overlay')
const tokenCustomer = localStorage.getItem('tokenCustomer')
const modalTermsAndPrivacy = new bootstrap.Modal(document.getElementById('useTermsAndPrivacy'));


// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {

	if (tokenCustomer) {

		window.location.href = '/choice-product'

	}

})

async function registerCustomer(event) {

  event.preventDefault()
  
  // GERENCIANDO ANIMAÇÃO DO BOTÃO
  buttonSignUpCustomer.setAttribute('data-kt-indicator', 'on')
  buttonSignUpCustomer.disabled = true

  // INSTANCIANDO FORMULÁRIO
  const formData = new FormData(formCustomer)

  // CONVERTENDO TODOS OS VALORES PARA CAIXA ALTA
  const uppercaseFormData = {}
  for (const [key, value] of formData.entries()) {
    if (key === 'email' || key === 'password' || key === 'confirm_password') {
      uppercaseFormData[key] = value
    } else {
      uppercaseFormData[key] = value.toUpperCase()
    }
  }

  uppercaseFormData.accept_terms = 1

  // CONVERTENDO PARA JSON
  const dataCustomer = JSON.stringify(uppercaseFormData)

  // // VALIDANDO USUÁRIO ÚNICO, CADASTRANDO CUSTOMER E ENVIANDO PARA O CADASTRO DE COMPANY COM ID
  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/customer' : configEnv.local_address + '/customer', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: dataCustomer,
  })
    .then((response) => response.json().then((data) => {

      console.log(data)
        if (data.status == 'success') {

          setTimeout(() => {

            registrationCustomerSuccess()

          }, 500)

        } else {

          setTimeout(() => {
            buttonSignUpCustomer.removeAttribute('data-kt-indicator', 'on')
            errorTextArea.innerText = `O cliente já possui cadastro ou o serviço está temporariamente indisponível. Tente novamente, ou se for o caso, recupere sua senha.`;
            buttonSignUpCustomer.disabled = false
          }, 500)

        }

      })
    )
    .catch((error) => console.log(error))
}

// INTERAÇÃO COM O BOTÃO DE VISUALIZAR SENHA - SENHA

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

// INTERAÇÃO COM O BOTÃO DE VISUALIZAR SENHA - CONFIRMAR SENHA

iconHideConfirmPassword.addEventListener('click', (event) => {
  inputConfirmPassword.type = 'text'
  iconHideConfirmPassword.classList.add('d-none')
  iconShowConfirmPassword.classList.remove('d-none')
})

iconShowConfirmPassword.addEventListener('click', (event) => {
  inputConfirmPassword.type = 'password'
  iconShowConfirmPassword.classList.add('d-none')
  iconHideConfirmPassword.classList.remove('d-none')

})

// NAVEGAÇÃO CADASTRO / LOGIN

linkMakeLogin.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

	setTimeout(() => {

    spinner.classList.remove('d-flex')
		window.location.href = '/'

	}, 500)

})

// ALERTA PERSONALIZADO

function registrationCustomerSuccess () {
  Swal.fire({
    title: 'Sucesso!',
    text: 'Seu cadastro foi realizado e enviamos a você um e-mail contendo um link para ativação da sua conta. Vamos te redirecionar para a tela de login, ok?',
    icon: 'success',
    confirmButtonColor: '#F05742',
    confirmButtonText: 'OK',
    customClass: {
    confirmButton: 'btn btn-primary-confirm',
    }
  }).then((result) => {
    window.location.href = '/'
  })
}


