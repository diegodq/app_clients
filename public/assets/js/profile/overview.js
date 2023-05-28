
const nameAndSurnameFieldProfile = document.getElementById('name-surname-profile-overview')
const fantasyNameCompanyFieldProfile = document.getElementById('company-name-profile-overview')
const positionFieldProfile = document.getElementById('position-profile-overview')
const emailFieldProfile = document.getElementById('email-profile-overview')
const fieldsOverview = document.querySelector('#fields_overview')
const spansOverview = fieldsOverview.querySelectorAll('span[data-chave]')
const avatarCustomer = document.getElementById('avatar-customer')
const buttonEditProfile = document.getElementById('button-edit-profile')
const overviewOptionMenu = document.getElementById('overview-menu')
const editProfileOptionMenu = document.getElementById('edit-profile-menu')
const billingOptionMenu = document.getElementById('billing-menu')
const servicesOptionMenu = document.getElementById('choice-product')
const paymentsFailLink = document.getElementById('alter-payments-data-overview')
const tokenCustomer = localStorage.getItem('tokenCustomer')

// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {

	function dropCostumer() {
		spinner.classList.add('d-flex')

		setTimeout(() => {

			spinner.classList.remove('d-flex')
			localStorage.clear()
			window.location.href = '/'


		}, 800)

		return dropCostumer()
	}

	if (!tokenCustomer) {

		dropCostumer()

	}

	try {
		fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/has-company' : configEnv.local_address + '/has-company', {
			headers: {
				'Authorization': 'Bearer ' + tokenCustomer,
				'Content-Type': 'application/json'
			},
		})
		.then(response => response.json())
		.then(data => {
		})
		.catch(error => {
			Swal.fire({
				title: 'Oopss...',
				text: 'Sua conexão excedeu o tempo limite e irá precisar fazer login novamente, ok? #voltaLogo',
				icon: 'warning',
				confirmButtonColor: '#F05742',
				confirmButtonText: 'OK',
				customClass: {
					confirmButton: 'btn btn-primary-confirm',
				}
			}).then((result) => {

				spinner.classList.add('d-flex')
				setTimeout(() => {

					spinner.classList.remove('d-flex')
					dropCostumer()

				}, 500)

			})
			dropCostumer()
			localStorage.clear()
		})
	} catch (error) {
		Swal.fire({
			title: 'Oopss...',
			text: 'Sua conexão excedeu o tempo limite e irá precisar fazer login novamente, ok? #voltaLogo',
			icon: 'warning',
			confirmButtonColor: '#F05742',
			confirmButtonText: 'OK',
			customClass: {
				confirmButton: 'btn btn-primary-confirm',
			}
		}).then((result) => {

			spinner.classList.add('d-flex')
			setTimeout(() => {

				spinner.classList.remove('d-flex')
				dropCostumer()

			}, 500)

		})
		dropCostumer()
		localStorage.clear()
	}

	fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/has-company' : configEnv.local_address + '/has-company', {
		headers: {
			'Authorization': 'Bearer ' + tokenCustomer,
			'Content-Type': 'application/json'
		},
	}).then(response => response.json()).then(data => {

		if (data.message === 'Acesso não autorizado.') {

			Swal.fire({
				title: 'Oopss...',
				text: 'Sua conexão excedeu o tempo limite e irá precisar fazer login novamente, ok? #voltaLogo',
				icon: 'warning',
				confirmButtonColor: '#F05742',
				confirmButtonText: 'OK',
				customClass: {
					confirmButton: 'btn btn-primary-confirm',
				}
			}).then((result) => {

				spinner.classList.add('d-flex')
				setTimeout(() => {

					spinner.classList.remove('d-flex')
					dropCostumer()

				}, 500)

			})

		}

		if (data.message === 'no-company') {

			Swal.fire({
				title: 'Espera um minuto...',
				text: 'Identificamos que você ainda não concluiu seu cadastro e isso é necessário para prosseguirmos. Iremos te encaminhar para que insira os dados que ainda estão pendentes.',
				icon: 'warning',
				confirmButtonColor: '#F05742',
				confirmButtonText: 'OK',
				customClass: {
					confirmButton: 'btn btn-primary-confirm',
				}
			}).then((result) => {

				spinner.classList.add('d-flex')
				setTimeout(() => {

					spinner.classList.remove('d-flex')
					window.location.href = '/sign-up-company'

				}, 500)

			})

		}

	}).catch(error => {
		dropCostumer()
		localStorage.clear()
	})

})

window.addEventListener('load', (event) => {

  const tokenCustomer = localStorage.getItem('tokenCustomer')
  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })
    .then((response) => response.json())
    .then((data) => {

      // ATUALIZA OS DADOS DO HEADER MENU

      nameCustomerHeader.innerText = data.first_name;
      positionCustomerHeader.innerText = data.position;

      // HEADER PROFILE USER

      nameAndSurnameFieldProfile.innerText = `${data.first_name} ${data.surname}`
      emailFieldProfile.innerText = data.email
      positionFieldProfile.innerText = data.position
      fantasyNameCompanyFieldProfile.innerText = data.fantasy_name

      // FUNCIONALIDADES PÁGINA OVERVIEW
      // PREENCHENDO CAMPOS

      for (let key in data) {
        if (key === 'first_name' || key === 'surname') {
          spansOverview.forEach((eachSpan) => {
            if (eachSpan.dataset.chave === 'name_and_surname') {
              eachSpan.innerText += ` ${data[key]} `;
            }
          });
        } else {
          spansOverview.forEach((eachSpan) => {
            if (key === eachSpan.dataset.chave) {
              eachSpan.innerText = data[key];
            }
          });
        }
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

        menuUserOptions.setAttribute('src', data.avatar)
        avatarCustomer.setAttribute('src', data.avatar)

      } else {

        menuUserOptions.setAttribute('src', '/assets/media/avatars/blank.png')
        avatarCustomer.setAttribute('src', '/assets/media/avatars/blank.png')

      }

    })

})

// BOTÃO DE EDITAR USUÁRIO E PENDÊNCIAS DE PAGAMENTO

buttonEditProfile.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {

    window.location.href = '/edit-profile-customer'

  }, 1500)


})

paymentsFailLink.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {

    window.location.href = '/billing'

  }, 1500)

})


// NAVEGAÇÃO MENU USER

editProfileOptionMenu.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {
    spinner.classList.remove('d-flex')
    window.location.href = '/edit-profile-customer'

  }, 1000)


})

billingOptionMenu.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {
    spinner.classList.remove('d-flex')
    window.location.href = '/billing'

  }, 1000)


})

servicesOptionMenu.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {
    spinner.classList.remove('d-flex')
    window.location.href = '/choice-product'

  }, 1000)

})

overviewOptionMenu.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {
    spinner.classList.remove('d-flex')
    window.location.href = '/overview'

  }, 1000)

})
