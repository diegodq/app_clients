const productNps = document.getElementById('product-nps')
const spinner = document.getElementById('spinner-overlay')
const tokenCustomer = localStorage.getItem('tokenCustomer')


// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {

    function dropCostumer() {
        spinner.classList.add('d-flex')

        setTimeout(() => {

            localStorage.clear()
            spinner.classList.remove('d-flex')
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

    })

})


productNps.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        window.location.href = '/dashboard'
        spinner.classList.remove('d-flex')

    }, 1000)


})
