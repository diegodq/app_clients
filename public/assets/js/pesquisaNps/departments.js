const buttonModalCancelRegisterDepartment = document.getElementById('button-cancel-add-departments')
const buttonModalRegisterDepartment = document.getElementById('button-submit-register-department')
const formRegisterDepartment = document.getElementById('departments-form')
const buttonRegisterDepartment = document.getElementById('button-add-departments')
const modalRegisterDepartment = new bootstrap.Modal(document.getElementById('modal-register-departments'), {
  keyboard: true
})
const tableDepartments = document.getElementById('departments_table')
const fieldnameDeparmentsModal = document.getElementsByName('name')[0]
const fieldstatusDeparmentsModal = document.getElementsByName('status')[0]
const fieldNoDepartments = document.getElementById('field-no-departments')
const searchInput = document.getElementById('search-input')
const spanbuttonRegisterDepartment = document.getElementById('span-button-register-department')
const errorFieldDepartment = document.getElementById('error-department-name-field')
const inputHiddenID = document.createElement('input')
inputHiddenID.type = 'hidden'
inputHiddenID.name = 'id'


window.addEventListener('load', (event) => {

  // LISTANDO FORMULÁRIO
  tableDepartments.querySelector('tbody').innerHTML = ''
  fillDepartmentsTable()

})

function statusDeparmentDepartment() {

  modalRegisterDepartment.show()

  if (fieldnameDeparmentsModal.value.length > 0) {

    spanbuttonRegisterDepartment.textContent = 'ALTERAR'

  } else {

    spanbuttonRegisterDepartment.textContent = 'CADASTRAR'

  }

}

buttonRegisterDepartment.addEventListener('click', event => {

  fieldnameDeparmentsModal.value = ''
  statusDeparmentDepartment()

})

// ACTIVE OR INACTIVE


function listenClickActive() {

  const input = document.querySelectorAll('input[type="checkbox"]')

  input.forEach(input => {
    input.addEventListener('click', (event) => {
      let idInputClicked = event.target.dataset.id

      if (input.checked === true) {

        const activeOrInative = { 'id': idInputClicked, 'new_status': '1' }

        fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/department' : configEnv.local_address + '/department', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${tokenCustomer}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(activeOrInative)

        })

      } else {

        const activeOrInative = { 'id': idInputClicked, 'new_status': '0' }

        fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/department' : configEnv.local_address + '/department', {
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

// C - CREATE DEPARTAMENTO

async function registerDepartment() {

  const formData = new FormData(formRegisterDepartment)

  const uppercaseFormData = {}
  for (const [key, value] of formData.entries()) {
    uppercaseFormData[key] = value.toUpperCase().trim()
  }

  uppercaseFormData.status = 1
  const dataDepartment = JSON.stringify(uppercaseFormData)

  console.log(dataDepartment)

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/department' : configEnv.local_address + '/department', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataDepartment
  })
    .then(response => response.json())
    .then(data => {

      console.log(data)

      if (data.status === 'success') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `O departamento foi cadastrado com sucesso!`
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

      } else if (data.message === 'Departamento já cadastrado.') {


        spinner.classList.add('d-flex')

        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `Ops, esse já existe!`
          textModalConfirm.innerText = `Já existe este departamento. Tente um nome diferente.`
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
          //location.reload()

        }, 2500)

      }

    })



}

buttonModalCancelRegisterDepartment.addEventListener('click', event => {

  modalRegisterDepartment.hide()
  setTimeout(() => {
    location.reload()
  }, 600)


})

// R - READ DEPARTAMENTO
function fillDepartmentsTable() {

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/company-departments' : configEnv.local_address + '/company-departments', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {


      if (data.message === 'no-departments') {

        fieldNoDepartments.innerText = 'Não há departamentos cadastrados.'

      } else {

        fieldNoDepartments.innerText = ''
        createRows(data)

      }
    })

}

async function createRows(data) {

  data.map((item, index) => {

    const row = tableDepartments.insertRow()
    const idDepartment = row.insertCell()
    const nameDeparment = row.insertCell()
    const statusDeparment = row.insertCell()
    const optionsRow = row.insertCell()

    idDepartment.innerHTML = item.id
    nameDeparment.innerHTML = item.name

    const checkedOrEmpty = item.status === 0 ? '' : 'checked'
    statusDeparment.innerHTML = `<label class="form-check form-switch form-check-custom activeReg form-check-solid">
    <input class="form-check-input" data-id=${item.id} type="checkbox" ${checkedOrEmpty ? 'checked' : ''} />
    </label>`
    optionsRow.innerHTML = `<div class="d-flex justify-content-between">
      <span class="btn btn-sm btn-outline-light rounded-pill update" data-id="${item.id}">
        <a>
          <i class="bi bi-pencil bi-lg cursor-pointer" data-id="${item.id}" data-name="${item.name}" data-status="${item.status}"></i>
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

  await listenClickDeleteIcon()
  await listenClickUpdate()
  listenClickActive()
}


// U - UPDATE DEPARTAMENTO

async function listenClickUpdate() {

  const spans = document.querySelectorAll('.btn-outline-light.rounded-pill.update');

  spans.forEach(span => {
    span.addEventListener('click', (event) => {
      let idIconClicked = span.querySelector('.bi-pencil').dataset.id
      let nameIconClicked = span.querySelector('.bi-pencil').dataset.name

      fieldnameDeparmentsModal.value = nameIconClicked
      inputHiddenID.value = idIconClicked
      formRegisterDepartment.appendChild(inputHiddenID)
      statusDeparmentDepartment()
    })
  })
}

function updateDepartment() {

  event.preventDefault()

  const formData = new FormData(formRegisterDepartment)

  const uppercaseFormData = {}
  for (const [key, value] of formData.entries()) {
    uppercaseFormData[key] = value.toUpperCase().trim()
  }

  const dataDepartment = JSON.stringify(uppercaseFormData)

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/department' : configEnv.local_address + '/department', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataDepartment
  })
    .then(response => response.json())
    .then(data => {

      if (data.message === 'Departamento atualizado.') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `A alteração de tópico foi realizada com sucesso!`
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

      } else if (data.message === 'Digite um nome diferente para este departamento.') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `Opss, esse já existe!`
          textModalConfirm.innerText = `Já existe este departamento. Tente um nome diferente!`
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

// D - DELETE

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

async function deleteDepartments(id) {


  const idDepartment = { 'id': id }


  const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/department' : configEnv.local_address + '/department', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(idDepartment)
  })

  const data = await response.json()

  console.log(data)

  if (data.status === 'success') {

    spinner.classList.add('d-flex')
    setTimeout(() => {

      spinner.classList.remove('d-flex')
      modalConfirm.show()

      titleModalConfirm.innerText = `SUCESSO!`
      textModalConfirm.innerText = `A exclusão do departamento foi realizada com sucesso!`
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

}


// ALERTA PERSONALIZADO CONFIRMAR EXCLUSÃO

function confirmarExclusao(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Você tem certeza que deseja excluir este departamento?',
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
  }).then(async (result) => {
    if (result.isConfirmed) {

      deleteDepartments(id)

    } else if (result.dismiss === Swal.DismissReason.cancel) {
      location.reload()
    }
  })
}


// CAMPO DE BUSCA DA PÁGINA

searchInput.addEventListener('keyup', function (event) {
  const searchValue = event.target.value.toLowerCase();
  const rows = Array.from(tableDepartments.getElementsByTagName('tr'));

  rows.forEach((row, index) => {

    if (index === 0) return

    const found = Array.from(row.getElementsByTagName('td')).some((cell) => {
      const text = cell.textContent.toLowerCase()
      return text.includes(searchValue)
    })

    row.style.display = found ? '' : 'none'
  })
})

