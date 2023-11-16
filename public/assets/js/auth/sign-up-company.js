const formStateCompany = document.querySelector('[name="state"]');
const formDistricCompany = document.querySelector('[name="district"]');
const formAddressCompany = document.querySelector('[name="address"]')
const formCityCompany = document.querySelector('[name="city"]')
const formCompany = document.getElementById('company_form');
const buttonSignUpCompany = document.getElementById('button_sign_up_company')
const errorTextArea = document.getElementById('error-area')
const errorZipCodeField = document.getElementById('error-zipcode-field')
const tokenCustomer = localStorage.getItem('tokenCustomer')
const spinner = document.getElementById('spinner-overlay')
const modalConfirm = new bootstrap.Modal(document.getElementById('alertModal'), {
  keyboard: true
})

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

    if (data.message === 'has-company') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          window.location.href = '/dashboard'

        }, 500)

    }

  })

})

// CONSULTA CEP
const inputZIPCode = document.querySelector('[name="zip_code"]')
if (inputZIPCode) {
  inputZIPCode.addEventListener('focusout', function (event) {
    const companyZIPCode = inputZIPCode.value.replace(/\D/g, '')

    fetch(`https://viacep.com.br/ws/${companyZIPCode}/json/`).then(
      (response) =>
        response.json().then((data) => {
          if (data.erro) {

            errorZipCodeField.innerText = 'O CEP não existe, ou o serviço está indisponível. Tente novamente.'

          } else {
            errorZipCodeField.innerText = ''
            formStateCompany.value = data.uf
            formAddressCompany.value = data.logradouro;
            formDistricCompany.value = data.bairro;
            formCityCompany.value = data.localidade;

          }
        }),
    )
      .catch((error) => console.log(error));
  });
}

async function registerCompany(event) {

  event.preventDefault()


  // INSTANCIANDO FORMULÁRIO
  const formData = new FormData(formCompany)

  // CONVERTENDO TODOS OS VALORES PARA CAIXA ALTA
  const uppercaseFormData = {}
  for (const [key, value] of formData.entries()) {
    uppercaseFormData[key] = value.toUpperCase()
  }

  // CONVERTENDO PARA JSON
  const dataCompany = JSON.stringify(uppercaseFormData)

  //VALIDANDO CNPJ ÚNICO E CADASTRANDO COMPANY
  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/company' : configEnv.local_address + '/company', {
		method: 'POST',
    headers: {
			Authorization: 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataCompany
  })
    .then((response) =>
      response.json().then((data) => {
        
        console.log(data)
        if (data.message == 'success') { 
  
         linkProductCompany(data.companyId) 

          setTimeout(() => {

            modalConfirm.show()

          }, 500);

          setTimeout(() => {

            modalConfirm.hide()
            window.location.href = '/dashboard'

          }, 2000)


        } else {

          setTimeout(() => {
            buttonSignUpCompany.removeAttribute('data-kt-indicator', 'on');
            errorTextArea.innerText = `Esta empresa já possui cadastro em nossa plataforma. Isso é estranho? Entre em contato com o suporte.`;
            buttonSignUpCompany.disabled = false;
          }, 1500)

        }


      }),
    )
}

async function linkProductCompany (companyID) {

  const idCompany = companyID
  const productID = 1

  const companyAndProduct = { company: idCompany, product: productID}

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address + '/link/company/product' : configEnv.local_address + '/link/company/product'}`, {
    method: 'POST',
    headers: {
			Authorization: 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(companyAndProduct)
  })

  const data = response.json()

}
