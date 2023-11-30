const buttonSiginAccActived = document.getElementById('button-sigin-acc-actived')
const contentCustomerActived = document.getElementById('content-costumer-actived')
const activatingMessage = document.getElementById('message-activating-conta')
const spinner = document.getElementById('spinner-overlay')
const activatingTimer = document.getElementById('timer-activating-account')
const fieldMessageDirectionActivating = document.getElementById('message-direction-activating')
const tokenCustomer = localStorage.getItem('tokenCustomer')

window.addEventListener('load', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        const params = new URLSearchParams(window.location.search)
        const customerData = { 'token': params.get('token'), 'id': params.get('id') }

        fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/active-customer' : configEnv.local_address + '/active-customer', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(customerData),
        }).then(response => response.json())
            .then(data => {
	
                if (data.status == 'success') {

                    let time = 15
                    function atualizaTempo() {
                        time--
                        activatingTimer.innerText = time
                        if (time <= 0) {
                            clearInterval(timer)
                            fieldMessageDirectionActivating.innerText = 'Redirecionando...'
                            spinner.classList.add('d-flex')
                            setTimeout(() => {
                                spinner.classList.remove('d-flex')
                                window.location.href = "/"
                            }, 1000)
                        }
                    }

                    let timer = setInterval(atualizaTempo, 1000)

                    spinner.classList.remove('d-flex')
                    contentCustomerActived.classList.remove('hidden-div')
                    activatingMessage.classList.add('hidden-div')
                    activatingTimer.innerText = time

                } else {

                    spinner.classList.remove('d-flex')
                    activatingMessage.innerText = 'Algo deu errado e não foi possível ativar sua conta. Entre em contato com nosso suporte.'

                }
            })
    }, 2000)

})

buttonSiginAccActived.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        spinner.classList.remove('d-flex')

    }, 1500);

    setTimeout(() => {

        window.location.href = '/'

    }, 1500)

})
