const buttonModalCancelRegisterStore = document.getElementById('button-cancel-add-stores')
const buttonModalRegisterStore = document.getElementById('button-submit-register-store')
const formRegisterStore = document.getElementById('stores-form')
const buttonRegisterStore = document.getElementById('button-add-stores')
const modalRegisterStore = new bootstrap.Modal(document.getElementById('modal-register-stores'), {
  keyboard: true
})
const tableStores = document.getElementById('stores_table')
const fieldNameStoresModal = document.getElementsByName('name')[0]
const fieldNumberStoresModal = document.getElementsByName('number')[0]
const fieldAddressStoresModal = document.getElementsByName('address')[0]
const fieldstatusStoresModal = document.getElementsByName('status')[0]
const fieldNoStores = document.getElementById('field-no-stores')
const searchInput = document.getElementById('search-input')
const spanbuttonRegisterStore = document.getElementById('span-button-register-store')

const inputHiddenID = document.createElement('input')
inputHiddenID.type = 'hidden'
inputHiddenID.name = 'id'

window.addEventListener('load', async (event) => {
  const allowMultiStore = await multiStoreAvailable()

  if (!allowMultiStore) {

    window.location.href = '/dashboard'

  }

  fillStoresTable()
})

async function fillStoresTable() {

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/list/store' : configEnv.local_address + '/list/store', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(async data => {

      console.log(data.message)

      if (data.message === 'no-store') {

        fieldNoStores.innerText = 'Não há lojas cadastradas.'

      } else {

        fieldNoStores.innerText = ''
        await createRows(data.message)

      }

    })

}

async function createRows(data) {

  data.map((item, index) => {

    const row = tableStores.insertRow()
    const numberStore = row.insertCell()
    const nameStore = row.insertCell()
    const storeAddress = row.insertCell()
    const statusStore = row.insertCell()
    const optionsRow = row.insertCell()

    numberStore.innerHTML = item.store_number
    nameStore.innerHTML = item.name
    storeAddress.innerHTML = item.address

    const checkedOrEmpty = item.active === 0 ? '' : 'checked'
    statusStore.innerHTML = `<label class="form-check form-switch form-check-custom activeReg form-check-solid">
      <input class="form-check-input dynamic-checkbox" data-storeNumber=${item.store_number} type="checkbox" ${checkedOrEmpty ? 'checked' : ''} />
      </label>`
    optionsRow.innerHTML = `<div class="d-flex justify-content-between">
        <span class="btn btn-sm btn-outline-light rounded-pill update" data-id="${item.id}">
          <a>
            <i class="bi bi-pencil bi-lg cursor-pointer" data-id="${item.id}" data-name="${item.name}" data-number="${item.store_number}" data-address="${item.address}"></i>
          </a>
        </span>
        <span class="btn btn-sm btn-outline-light rounded-pill delete" data-id="${item.id}">
        <a>
          <i class="bi bi-trash bi-lg cursor-pointer" data-id="${item.id}"></i>
        </a>
      </span>
      </div>
      `

    row.classList.add('text-gray-800', 'text-center')

    return row

  })

  await listenClickUpdate()
  await listenClickActive()
  await listenClickDeleteIcon()
}

function statusStore() {

  modalRegisterStore.show()

  if (fieldNameStoresModal.value.length > 0) {

    spanbuttonRegisterStore.textContent = 'ALTERAR'

  } else {

    spanbuttonRegisterStore.textContent = 'CADASTRAR'

  }

}

buttonRegisterStore.addEventListener('click', event => {

  fieldNameStoresModal.value = ''
  statusStore()

})

buttonModalCancelRegisterStore.addEventListener('click', event => {

  modalRegisterStore.hide()
  setTimeout(() => {
    location.reload()
  }, 600)


})

async function registerStore() {

  const inputStoreName = document.getElementById('name')
  const inputStoreAddress = document.getElementById('address')
  const inputStoreNumber = document.getElementById('number')

  const newDataForm = { name: inputStoreName.value.toUpperCase().trim(), address: inputStoreAddress.value.toUpperCase().trim(), store_number: Number(inputStoreNumber.value) }

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/create/store' : configEnv.local_address + '/create/store', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newDataForm)
  })
    .then(response => response.json())
    .then(data => {

      console.log(data)
      
      if (data.message === 'new-store-added') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `A loja foi cadastrado com sucesso!`
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

      } else {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `FALHA`
          textModalConfirm.innerText = `Algo deu errado e o cadastro não foi realizado conforme sua solicitação. Tente novamente!`
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

        }, 500);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 2500)

      }

    })

}

function updateStore() {

  const formData = new FormData(formRegisterStore)

  const uppercaseFormData = {}
  for (const [key, value] of formData.entries()) {
    uppercaseFormData[key] = value.toUpperCase().trim()
  }

  const dataStore = JSON.stringify(uppercaseFormData)

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/edit/store' : configEnv.local_address + '/edit/store', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataStore
  })
    .then(response => response.json())
    .then(data => {

      console.log(data)

      if (data.message === 'store-updated') {

        spinner.classList.add('d-flex')

        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `A alteração de loja foi realizada com sucesso!`
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

      } else if (data === 'store-already-registered') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `Opss, esse já existe!`
          textModalConfirm.innerText = `Já existe uma loja com esses dados. Tente um nome diferente!`
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


        }, 500);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 2500)


      } else {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `FALHA`
          textModalConfirm.innerText = `Algo deu errado e a alteração não foi realizada conforme sua solicitação. Tente novamente!`
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


        }, 500);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 2500)

      }

    })

}


async function listenClickActive() {

  const inputs = document.querySelectorAll('.dynamic-checkbox')

  inputs.forEach(input => {

    input.addEventListener('click', (event) => {

      let storeNumberInputClicked = event.target.dataset.storenumber

      if (input.checked === true) {

        const activeOrInative = { 'store_number': storeNumberInputClicked, 'status': '1' }

        fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/status/store' : configEnv.local_address + '/status/store', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokenCustomer}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(activeOrInative)

        })

      } else {

        const activeOrInative = { 'store_number': storeNumberInputClicked, 'status': '0' }

        fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/status/store' : configEnv.local_address + '/status/store', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokenCustomer}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(activeOrInative)

        })

      }



    })
  })
}

async function listenClickUpdate() {

  const spans = document.querySelectorAll('.btn-outline-light.rounded-pill.update');

  spans.forEach(span => {
    span.addEventListener('click', (event) => {
      let idIconClicked = span.querySelector('.bi-pencil').dataset.id
      let nameIconClicked = span.querySelector('.bi-pencil').dataset.name
      let numberIconClicked = span.querySelector('.bi-pencil').dataset.number
      let addressIconClicked = span.querySelector('.bi-pencil').dataset.address


      fieldNameStoresModal.value = nameIconClicked
      fieldNumberStoresModal.value = numberIconClicked
      fieldNumberStoresModal.disabled = true
      fieldAddressStoresModal.value = addressIconClicked
      inputHiddenID.value = idIconClicked
      formRegisterStore.appendChild(inputHiddenID)
      statusStore()

    })
  })
}

async function listenClickDeleteIcon() {
  // OUVINDO CLICK EXCLUIR - INSERIR FETCH DE DELETE
  const spans = document.querySelectorAll('.btn-outline-light.rounded-pill.delete')
  spans.forEach(span => {
    span.addEventListener('click', (event) => {
      let idIconClicked = event.target.dataset.id;
      confirmarExclusao(idIconClicked)
    })
  })
}

document.getElementById('number').addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
});

function deleteStores(id) {

  const idStore = { 'id_store': id }

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/remove/store' : configEnv.local_address + '/remove/store', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(idStore)
  })
    .then(response => response.json())
    .then(data => {

      if (data.status === 'success') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `A exclusão da loja foi realizada com sucesso!`
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

      } else {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `FALHA`
          textModalConfirm.innerText = `Algo deu errado e a exclusão não foi realizada conforme sua solicitação. Tente novamente!`
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


        }, 500);

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 2500)

      }

    })

}

function confirmarExclusao(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Você tem certeza que deseja excluir esta loja? Todas as pesquisas referente a esta loja também serão excluídas. Deseja prosseguir?',
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
      Swal.fire({
        title: 'ATENÇÃO!!',
        text: 'Esta ação é irreversível. Tem certeza absoluta de que deseja excluir esta loja? TODOS OS DADOS RELACIONADOS A ESSA LOJA SERÃO EXCLUÍDOS.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F05742',
        cancelButtonColor: '#transparent',
        confirmButtonText: 'Sim, tenho certeza!',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-primary-confirm',
          cancelButton: 'btn btn-light btn-active-light-primary'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          deleteStores(id);
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      location.reload();
    }
  });
}

// CAMPO DE BUSCA DA PÁGINA

searchInput.addEventListener('keyup', function (event) {
  const searchValue = event.target.value.toLowerCase();
  const rows = Array.from(tableStores.getElementsByTagName('tr'));

  rows.forEach((row, index) => {

    if (index === 0) return

    const found = Array.from(row.getElementsByTagName('td')).some((cell) => {
      const text = cell.textContent.toLowerCase()
      return text.includes(searchValue)
    })

    row.style.display = found ? '' : 'none'
  })
})
