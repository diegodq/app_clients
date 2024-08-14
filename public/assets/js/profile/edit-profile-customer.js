const nameAndSurnameFieldProfile = document.getElementById('name-surname-profile-overview')
const fantasyNameCompanyFieldProfile = document.getElementById('company-name-profile-overview')
const positionFieldProfile = document.getElementById('position-profile-overview')
const emailFieldProfile = document.getElementById('email-profile-overview')
const emailFieldModalCancelAccount = document.getElementById('confirm-email-cancel-account')
const passFieldModalCancelAccount = document.getElementById('confirm-password-cancel-account')
const inputsEditProfile = document.querySelectorAll('input[data-chave]')
const inputAvatarCustomer = document.getElementById('avatar')
const inputPayment = document.getElementById('input-payments-edit')
const inputNewsLetter = document.getElementById('input-newsletter-edit')
const inputCancelCustomer = document.getElementById('checked-cancel-input')
const emailAlterSection = document.getElementById('email-alter-section')
const avatarCustomer = document.getElementById('avatar-customer')
const overviewOptionMenu = document.getElementById('overview-menu')
const editProfileOptionMenu = document.getElementById('edit-profile-menu')
const billingOptionMenu = document.getElementById('billing-menu')
const servicesOptionMenu = document.getElementById('choice-product')
const formStateCompany = document.querySelector('[name="state"]')
const formDistricCompany = document.querySelector('[name="district"]')
const formAddressCompany = document.querySelector('[name="address"]')
const formCityCompany = document.querySelector('[name="city"]')
const formDeleteAccountModal = document.getElementById('form-account-delete')
const formDeleteAccount = document.getElementById('kt_account_deactivate_form')
const formEditCustomer = document.getElementById('edit-customer-form')
const formEditCompany = document.getElementById('edit-company-form')
const formEditEmailAccount = document.getElementById('kt_signin_change_email')
const formEditPreferencesEmail = document.getElementById('form-emails-preferences')
const errorFieldPassChangeEmailform = document.getElementById('error-password-change-email')
const errorFieldPassChangePassform = document.getElementById('error-password-change-password')
const errorFieldEmailCancelAccount = document.getElementById('error-email-cancel-account')
const errorFieldPassCancelAccount = document.getElementById('error-password-cancel-account')
const deleteAvatarIcon = document.getElementById('delete-avatar-icon')
const fieldErrorAvatarSize = document.getElementById('error-avatar-size')
const fieldErrorDeleteAccount = document.getElementById('error-field-delete-account-modal')
const buttonCallCancelModal = document.getElementById('button-call-delete-account')
const buttonCancelModal = document.getElementById('button-cancel-delete-account')
const modalDeleteAccount = new bootstrap.Modal(document.getElementById('cancelAccount'), {
  keyboard: true
})
const usersOptionMenu = document.getElementById('users-menu')


// BUSCAR INFORMAÇÕES DO USUÁRIO NA API
window.addEventListener('load', (event) => {

  formEditCustomer.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  formEditCompany.addEventListener('submit', (event) => {
    event.preventDefault();
  });


  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })
    .then((response) => response.json())
    .then((data) => {
      // ATUALIZA OS DADOS DO HEADER MENU

      nameCustomerHeader.innerText = data[0].first_name;
      positionCustomerHeader.innerText = data[0].position;

      // HEADER PROFILE USER

      nameAndSurnameFieldProfile.innerText = `${data[0].first_name} ${data[0].surname}`
      emailFieldProfile.innerText = data[0].email
      positionFieldProfile.innerText = data[0].position
      fantasyNameCompanyFieldProfile.innerText = data[0].fantasy_name

      // E-MAIL DA SEÇÃO DE ALTERAR E-MAIL

      emailAlterSection.innerText = data[0].email

      // CHECK DE PREFERÊNCIAS DE CONTATO

      inputPayment.checked = data[0].info_payment === 1 ? true : false
      inputNewsLetter.checked = data[0].accept_newsletter === 1 ? true : false

      // FUNCIONALIDADES PÁGINA EDIT-PROFILE
      // PREENCHENDO CAMPOS

      for (let key in data[0]) {

        inputsEditProfile.forEach(eachInput => {

          if (key === eachInput.dataset.chave) {
            eachInput.value = data[0][key]
          }

        })

      }
    })

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/avatar' : configEnv.local_address + '/avatar', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.avatar) {
        deleteAvatarIcon.style.display = 'block'
        menuUserOptions.setAttribute('src', data.avatar)
        avatarCustomer.setAttribute('src', data.avatar)

      } else {

        deleteAvatarIcon.style.display = 'none'
        menuUserOptions.setAttribute('src', '/assets/media/avatars/blank.png')
        avatarCustomer.setAttribute('src', '/assets/media/avatars/blank.png')

      }


  }).catch(error => console.log(error))

})

// EVENTO SE HOUVER ALTERAÇÃO NOS DADOS DO FORMULÁRIO HABILITAR BOTÃO

formEditCustomer.addEventListener('change', function () {

  document.getElementById('alter-data-customer').disabled = false
  document.getElementById('cancel-alter-data-customer').disabled = false

})

formEditCompany.addEventListener('change', function () {

  document.getElementById('alter-data-company').disabled = false
  document.getElementById('cancel-alter-data-company').disabled = false

})

formEditPreferencesEmail.addEventListener('change', function () {

  document.getElementById('save-alter-email-preference').disabled = false
  document.getElementById('discard-alter-email-preference').disabled = false

})

// UPDATE - UPDATE DE EMPRESA, USUÁRIO, E-MAIL, SENHA, FOTO E PREFERÊNCIAS DE CONTATO

function editDataCompany() {

  formEditCompany.addEventListener('submit', (event) => {
    event.preventDefault();
  });


  // INSTANCIANDO FORMULÁRIO
  const formData = new FormData(formEditCompany);

  // CONVERTENDO TODOS OS VALORES PARA CAIXA ALTA
  const uppercaseFormData = {};
  for (const [key, value] of formData.entries()) {
    uppercaseFormData[key] = value.toUpperCase();
  }

  // CONVERTENDO PARA JSON
  const dataCompany = JSON.stringify(uppercaseFormData);

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/company' : configEnv.local_address + '/company', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataCompany
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {

        spinner.classList.add('d-flex')

        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `Os dados da empresa foram alterados com sucesso!`
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

        }, 1000);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 3000)

      } else {

        spinner.classList.add('d-flex')

        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `FALHA`
          textModalConfirm.innerText = `Os dados não foram alterados. Verifique os campos e tente novamente.`
          iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-warning svg-icon-5hx"><svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none">
                    <path opacity="0.3"
                        d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z"
                        fill="black" />
                    <path
                        d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z"
                        fill="black" />
                </svg></span>`


        }, 1000);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 3000)

      }

    })

}

function editDataCustomer() {

  // INSTANCIANDO FORMULÁRIO
  const formData = new FormData(formEditCustomer);

  // CONVERTENDO TODOS OS VALORES PARA CAIXA ALTA
  const uppercaseFormData = {}

  for (const [key, value] of formData.entries()) {
    uppercaseFormData[key] = value.toUpperCase()
  }

  // CONVERTENDO PARA JSON
  const dataCustomer = JSON.stringify(uppercaseFormData);

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/customer' : configEnv.local_address + '/customer', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataCustomer
  })
    .then(response => response.json())
    .then(data => {

      if (data.status === 'success') {

        spinner.classList.add('d-flex')

        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `Os dados de Usuário foram alterados com sucesso!`
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

        }, 1000);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 3000)

      } else {

        spinner.classList.add('d-flex')

        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `FALHA`
          textModalConfirm.innerText = `Os dados não foram alterados. Verifique os campos e tente novamente.`
          iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-warning svg-icon-5hx"><svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none">
                    <path opacity="0.3"
                        d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z"
                        fill="black" />
                    <path
                        d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z"
                        fill="black" />
                </svg></span>`


        }, 1000);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 3000)

      }

    })

}

function discardChanges() {

  location.reload()

}

inputAvatarCustomer.addEventListener('change', () => {

  const file = inputAvatarCustomer.files[0]

  if (file.size > 1000000) {

    fieldErrorAvatarSize.innerText = 'A imagem inserida excede o tamanho permitido de 1mb.'

  } else {

    const formData = new FormData();
    formData.append('file', file)

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/avatar' : configEnv.local_address + '/avatar', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${tokenCustomer}`
      },
      body: formData
    })
      .then(response => response.json()
        .then(data => {

          if (data.status === 'success') {

            spinner.classList.add('d-flex')

            setTimeout(() => {

              spinner.classList.remove('d-flex')
              modalConfirm.show()

              titleModalConfirm.innerText = `SUCESSO!`
              textModalConfirm.innerText = `A sua foto de perfil foi alterada com sucesso!`
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

            }, 1000);

            setTimeout(() => {

              modalConfirm.hide()
              location.reload()

            }, 3000)

          } else {

            spinner.classList.add('d-flex')

            setTimeout(() => {

              spinner.classList.remove('d-flex')
              modalConfirm.show()

              titleModalConfirm.innerText = `FALHA`
              textModalConfirm.innerText = `Sua foto não foi alterada corretamente. Verifique os requisitos da imagem e tente novamente.`
              iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-warning svg-icon-5hx"><svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none">
                    <path opacity="0.3"
                    d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z"
                    fill="black" />
                    <path
                    d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z"
                    fill="black" />
                    </svg></span>`


            }, 1000);

            setTimeout(() => {

              modalConfirm.hide()
              location.reload()

            }, 3000)
          }

        }))

  }

})

function emailChange() {
  spinner.classList.add('d-flex');

  getMoreInformationUser().then(data => {

    let dataUser = {
      'password': document.getElementById('password-email-change').value, 'new_email': document.getElementById('new-email-change').value, agent_user: platform.name,
      system_user: platform.os.family, city: data.district, country_capital: data.state_prov, country_name: data.country_name
    }

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/customer/email' : configEnv.local_address + '/customer/email', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataUser)
    })
      .then(response => response.json()
        .then(data => {
          if (data.status === 'success') {
            spinner.classList.remove('d-flex')
            Swal.fire({
              title: 'Sucesso!',
              text: 'Enviamos as instruções para efetivar a troca ao novo e-mail informado. Ah, a troca só será efetivada se validar a solicitação por lá, ok?',
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
                location.reload()
              }, 600)
            })
          } else if (data.message === 'Senha incorreta.') {

            setTimeout(() => {
              spinner.classList.remove('d-flex')
              errorFieldPassChangeEmailform.innerText = 'A senha inserida está incorreta.'
            }, 1000)


          } else {
            spinner.classList.add('d-flex')

            setTimeout(() => {
              spinner.classList.remove('d-flex')
              modalConfirm.show()

              const button = document.createElement("button")
              button.textContent = "Entendi"
              button.classList.add("btn", "btn-primary")
              button.setAttribute("onclick", "modalConfirm.hide(); location.reload()")

              modalConfirm.show()

              titleModalConfirm.innerText = `FALHA`
              textModalConfirm.innerHTML = `<div>O e-mail <strong>não</strong> foi alterado conforme solicitação. O serviço pode estar indisponível ou novo e-mail inserido já possui cadastro em nossa plataforma.</div>`
              iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-warning svg-icon-5hx"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black" />
					<path d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black" />
					</svg></span><br><br><br>`
              iconModalConfirm.appendChild(button)
            }, 500);
          }
        }))
      .catch(error => {
        console.log(error)
      })
  })
}

async function passwordChange() {
  spinner.classList.add('d-flex')

  getMoreInformationUser().then(data => {

    let dataUser = {
      'new_password': document.getElementById('newpassword').value, 'old_password': document.getElementById('currentpassword').value, agent_user: platform.name,
      system_user: platform.os.family, city: data.city, country_capital: data.country_capital, country_name: data.country_name
    }

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/customer/password' : configEnv.local_address + '/customer/password', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataUser)
    })
      .then(response => response.json())
      .then(data => {
        errorFieldPassChangePassform.innerText = ''
        if (data.status === 'success') {

          setTimeout(() => {
            spinner.classList.remove('d-flex')
            modalConfirm.show()

            titleModalConfirm.innerText = `SUCESSO!`
            textModalConfirm.innerText = `A sua senha foi alterada com sucesso!`
            iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-success svg-icon-5hx ">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		      <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black" />
		      <path d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z" fill="black" />
		      </svg>
		      </span>`
          }, 1000);

          setTimeout(() => {
            modalConfirm.hide()
            location.reload()
          }, 2000)

        } else if (data.message === 'Senha antiga desconhecida.') {

          setTimeout(() => {
            spinner.classList.remove('d-flex')
            errorFieldPassChangePassform.innerText = 'A senha inserida está incorreta.'
          }, 1000)

        } else {

          setTimeout(() => {
            spinner.classList.remove('d-flex')
            modalConfirm.show()

            titleModalConfirm.innerText = `FALHA`
            textModalConfirm.innerText = `Algum problema aconteceu e a senha não foi alterada. Verifique os campos e tente novamente.`
            iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-warning svg-icon-5hx">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		      <path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black" />
		      <path d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black" />
		      </svg></span>`
          }, 1000);

          setTimeout(() => {
            modalConfirm.hide()
            location.reload()
          }, 2000)
        }
      })
  })
}

function newsletterPayment() {
  formEditPreferencesEmail.addEventListener('submit', (event) => {
    event.preventDefault()
  })

  inputPayment.value = inputPayment.checked == true ? 1 : 0
  inputNewsLetter.value = inputNewsLetter.checked == true ? 1 : 0

  const dataInfo = { 'accept_newsletter': inputNewsLetter.value, 'info_payment': inputPayment.value }

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/info' : configEnv.local_address + '/info', {
    headers: {
      Authorization: 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(dataInfo)
  })
    .then(response => response.json()
      .then(data => {
        if (data.status === 'success') {
          spinner.classList.add('d-flex');

          setTimeout(() => {
            spinner.classList.remove('d-flex')
            modalConfirm.show();

            titleModalConfirm.innerText = `SUCESSO!`
            textModalConfirm.innerText = `As suas preferências de contato foram gravadas com sucesso!`
            iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-success svg-icon-5hx "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black" />
        <path d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z" fill="black" />
        </svg>
        </span>`
          }, 1000);

          setTimeout(() => {
            modalConfirm.hide()
            location.reload()
          }, 3000)
        } else {
          spinner.classList.add('d-flex')

          setTimeout(() => {
            spinner.classList.remove('d-flex');
            modalConfirm.show();
            titleModalConfirm.innerText = `FALHA`
            textModalConfirm.innerText = `As preferências não foram gravadas como solicitou. Tente novamente mais tarde.`
            iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-warning svg-icon-5hx">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z" fill="black" />
        <path d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black" />
        </svg></span>`
          }, 1000);

          setTimeout(() => {
            modalConfirm.hide()
            location.reload()
          }, 3000)
        }
      }))
    .catch(error => {
      console.log(error)
    })
}

// OPÇÕES DELETE
// EXCLUIR AVATAR
function deleteAvatar() {

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/avatar' : configEnv.local_address + '/avatar', {
    headers: {
      Authorization: `Bearer ${tokenCustomer}`
    }
  })
    .then((response) => response.json())
    .then((data) => {

      const breakUrl = data.avatar.split('/files/')
      const avatarNameAndExtension = breakUrl[1]

      const avatarData = { 'id': tokenCustomer, 'avatar': avatarNameAndExtension }

      fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/avatar' : configEnv.local_address + '/avatar', {
        headers: {
          Authorization: `Bearer ${tokenCustomer}`
        },
        method: 'DELETE',
        body: JSON.stringify(avatarData),
      })
        .then((response) => response.json())
        .then((data) => {

          if (data.status === 'success') {
            spinner.classList.add('d-flex')

            setTimeout(() => {
              spinner.classList.remove('d-flex')
              modalConfirm.show()
              titleModalConfirm.innerText = `SUCESSO!`
              textModalConfirm.innerText = `O avatar foi removido com sucesso!`
              iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-success svg-icon-5hx "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black" />
          <path d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z" fill="black" />
          </svg>
          </span>`
            }, 1000);

            setTimeout(() => {
              modalConfirm.hide()
              location.reload()
            }, 3000)
          } else {
            spinner.classList.add('d-flex')

            setTimeout(() => {
              spinner.classList.remove('d-flex')
              modalConfirm.show()

              titleModalConfirm.innerText = `FALHA`
              textModalConfirm.innerText = `Algum problema aconteceu e o seu avatar não foi removido. Tente novamente mais tarde.`
              iconModalConfirm.innerHTML = `<span class="svg-icon svg-icon-warning svg-icon-5hx"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path opacity="0.3" d="M6.7 19.4L5.3 18C4.9 17.6 4.9 17 5.3 16.6L16.6 5.3C17 4.9 17.6 4.9 18 5.3L19.4 6.7C19.8 7.1 19.8 7.7 19.4 8.1L8.1 19.4C7.8 19.8 7.1 19.8 6.7 19.4Z fill="black" />
          <path d="M19.5 18L18.1 19.4C17.7 19.8 17.1 19.8 16.7 19.4L5.40001 8.1C5.00001 7.7 5.00001 7.1 5.40001 6.7L6.80001 5.3C7.20001 4.9 7.80001 4.9 8.20001 5.3L19.5 16.6C19.9 16.9 19.9 17.6 19.5 18Z" fill="black" />
          </svg></span>`
            }, 1000);

            setTimeout(() => {
              modalConfirm.hide()
              location.reload()
            }, 3000)
          }
        })
    })
}

deleteAvatarIcon.addEventListener('click', (event) => {
  confirmarExclusao();
})

// * EVENTO DIMISS MODAL

buttonCancelModal.addEventListener('click', event => {
  fieldErrorDeleteAccount.innerText = ''
})

// EXCLUIR CONTA

function deleteAccount() {

  fieldErrorDeleteAccount.innerText = ''

  spinner.classList.add('d-flex')

  const dataCustomer = { 'email': emailFieldModalCancelAccount.value, 'password': passFieldModalCancelAccount.value }

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/customer' : configEnv.local_address + '/customer', {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataCustomer)
  }).then(response => response.json()).then(data => {
    setTimeout(() => {
      if (data.message === 'customer-removed') {

        spinner.classList.remove('d-flex')
        Swal.fire({
          title: 'Até breve!',
          text: 'Conforme prometido, seus dados foram excluídos definitivamente da nossa plataforma.',
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
            localStorage.clear()
            window.location.href = '/'
          }, 600)
        })

      } else if (data.message === 'incorrect-email-or-password') {

        spinner.classList.add('d-flex')

        setTimeout(() => {

          spinner.classList.remove('d-flex')
          fieldErrorDeleteAccount.innerText = 'O e-mail ou senha não corresponde com o de cadastro. Verifique e tente novamente.'
          passFieldModalCancelAccount.value = ''


        }, 600)


      } else {
        spinner.classList.remove('d-flex')
        Swal.fire({
          title: 'Erro!',
          text: 'Algo inesperado aconteceu e não foi possível excluir sua conta. Por favor repita o processo e se o problema persistir pocure nossa equipe de suporte.',
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
  })
}


// FERRAMENTAS DE LAYOUT - MOVIMENTO DE FORMULÁRIO
function changeEmailEditProfile() {
  if (document.getElementById('kt_signin_email_button').classList.contains('d-none')) {
    document.getElementById('kt_signin_email_button').classList.remove('d-none')
    document.getElementById('kt_signin_email').classList.remove('d-none')
    document.getElementById('kt_signin_email_edit').classList.add('d-none')
  } else {
    document.getElementById('kt_signin_email_button').classList.add('d-none')
    document.getElementById('kt_signin_email').classList.add('d-none')
    document.getElementById('kt_signin_email_edit').classList.remove('d-none')
  }
}

function changePasswordEditProfile() {
  if (document.getElementById('kt_signin_password_button').classList.contains('d-none')) {
    document.getElementById('kt_signin_password_button').classList.remove('d-none')
    document.getElementById('kt_signin_password').classList.remove('d-none')
    document.getElementById('kt_signin_password_edit').classList.add('d-none')
  } else {
    document.getElementById('kt_signin_password_button').classList.add('d-none')
    document.getElementById('kt_signin_password').classList.add('d-none')
    document.getElementById('kt_signin_password_edit').classList.remove('d-none')
  }
}

// NAVEGAÇÃO MENU USER
editProfileOptionMenu.addEventListener('click', (event) => {
  spinner.classList.add('d-flex')

  setTimeout(() => {
    window.location.href = '/edit-profile-customer'
  }, 1000)
})

billingOptionMenu.addEventListener('click', (event) => {
  spinner.classList.add('d-flex')

  setTimeout(() => {
    window.location.href = '/billing'
  }, 1000)
})

servicesOptionMenu.addEventListener('click', (event) => {
  spinner.classList.add('d-flex')

  setTimeout(() => {
    window.location.href = '/choice-product'
  }, 1000)
})

overviewOptionMenu.addEventListener('click', (event) => {
  spinner.classList.add('d-flex')

  setTimeout(() => {
    window.location.href = '/overview'
  }, 1000)
})


function addClickEventUsersManager() {

  spinner.classList.add('d-flex')

  setTimeout(() => {

      window.location.href = '/users'

  }, 1000)


}

usersOptionMenu.addEventListener('click', addClickEventUsersManager)


// NOTIFICAÇÕES PERSONALIZADAS

function confirmarExclusao() {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Você tem certeza que deseja excluir o avatar desta conta?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F05742',
    cancelButtonColor: '#transparent',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn btn-primary-confirm',
      cancelButton: 'btn btn-light btn-active-light-primary'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      deleteAvatar()
    }
  })
}

// PEGANDO INFORMAÇÕES DE LOCALIDADE, DISPOSITIVO E ETC.
async function getMoreInformationUser() {
  return fetch(configEnv.geoLocator)
    .then(async response => {
      return response.json()
        .then(data => { return data })
    })
    .catch(error => console.log(error))
}



