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


// BUSCA DADOS
window.addEventListener('load', (event) => {

    // PREENCHENDO DADOS DE USUÁRIO NO SUB-MENU


    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
        headers: {
            'Authorization': `Bearer ${tokenCustomer}`
        }
    })
        .then((response) => response.json())
        .then((data) => {

            // DADOS USER MENU HEADER

            nameCustomerHeader.innerText = data.first_name
            positionCustomerHeader.innerText = data.position

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
            } else {
                menuUserOptions.setAttribute('src', '/assets/media/avatars/blank.png')
            }

        })
})

