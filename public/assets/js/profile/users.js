const nameAndSurnameFieldProfile = document.getElementById('name-surname-profile-users')
const emailFieldProfile = document.getElementById('email-profile-users')
const positionFieldProfile = document.getElementById('position-profile-users')
const fantasyNameCompanyFieldProfile = document.getElementById('company-name-profile-users')
const avatarCustomer = document.getElementById('avatar-customer')
const buttonEditProfile = document.getElementById('button-edit-profile')
const overviewOptionMenu = document.getElementById('overview-menu')
const editProfileOptionMenu = document.getElementById('edit-profile-menu')
const billingOptionMenu = document.getElementById('billing-menu')
const servicesOptionMenu = document.getElementById('choice-product')
const usersOptionMenu = document.getElementById('users-menu')
const modalEditUser = new bootstrap.Modal(document.getElementById('editUserModal'))


window.addEventListener('load', async (event) => {

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


  const userTypeList = await getListTypeCustomer()

  populateSelectTypeUser(userTypeList, 'type_user');

})


document.addEventListener('DOMContentLoaded', async function () {

  const listUsers = await getUserList()
  console.log(listUsers)

  renderUserList(listUsers);


});


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

async function createUserCard(user) {

  const actualUser = await getDetailsCustomerOn()

  console.log(actualUser)
  console.log(user)

  let statusBadge = '';
  let statusText = '';

  if (user.activated === 0) {
    statusBadge = `<span class="badge bg-secondary me-2"> </span>`;
    statusText = '<span style="font-size: 15px; color: gray;">Pendente</span>';
  } else if (user.activated === 1) {
    statusBadge = `<span class="badge bg-success me-2"> </span>`;
    statusText = '<span style="font-size: 15px; color: green;">Confirmado</span>';
  }

  const resendEmailButton = `<button class="btn btn-primary btn-sm resend-email-button" onclick="handleResendButtonClick(event, ${user.id}, '${user.email}')">
  
  <span class='indicator-label'> REENVIAR E-MAIL </span>
  <span class='indicator-progress'>
  <span class='spinner-border spinner-border-sm align-middle ms-2'></span>
  </span>
  
  </button>`;

  const editIcon = `<i class="fas fa-edit me-2" style="color: #F05742; cursor: pointer;" onclick="handleEditClick(event, ${user.id})" style="cursor: pointer;" title="Editar"></i>`;
  const deleteIcon = `<i class="fas fa-trash-alt style="color: #F05742;" onclick="handleDeleteClick(event, ${user.id})" style="cursor: pointer;" title="Excluir"></i>`;

  const avatar = user.avatar.split('/avatar/')

  const userCard = `
    <div class="card border rounded mb-3">
      <div class="card-header cursor-pointer d-flex align-items-center" id="heading${user.id}" style="font-size: 24px;" data-toggle="collapse" data-target="#collapse${user.id}" aria-expanded="true" aria-controls="collapse${user.id}">
        <h5 class="mb-0">
          <button class="btn btn-link text-decoration-none">
            <span style="font-size: 20px;"># ${user.first_name} ${user.surname}</span>
          </button>
        </h5>
        ${user.role != "ADMINISTRADOR" && user.id != actualUser.user_id ? `<div class="ms-auto">${editIcon} ${deleteIcon}</div>` : ''
    }
      </div>
      <div id="collapse${user.id}" class="collapse" aria-labelledby="heading${user.id}">
        <div class="card-body" style="font-size: 20px;">
          <div class="d-flex">
            <div class="m-2">
              <img src="${avatar[1] == 'null' ? "assets/media/avatars/blank.png" : user.avatar}" alt="Avatar" width="100">
            </div>
            <div class="m-2">
              <p style="font-size: 20px;" class="text-muted"><span class="text-muted fw-bolder">Nome:</span> ${user.first_name} ${user.surname}</p>
              <p style="font-size: 20px;" class="text-muted"><span class="text-muted fw-bolder">Função:</span> ${user.position}</p>
              <p style="font-size: 20px;" class="text-muted"><span class="text-muted fw-bolder">Tipo de Usuário:</span> ${user.role}</p>
            </div>
          </div>
          <p style="font-size: 20px;" class="text-muted text-center">
            <span class="text-muted fw-bolder">Email:</span> ${user.email}
            - ${statusBadge}${statusText}<p class="text-center">${user.activated === 0 ? resendEmailButton : ''}</p>
          </p>
        </div>
      </div>
    </div>
  `;

  return userCard;
}

async function handleEditClick(event, userID) {

  event.preventDefault();

  const buttonCancelModalUpdate = document.getElementById('modal_cancelButton')

  buttonCancelModalUpdate.addEventListener('click', () => {
    modalEditUser.hide()
    location.reload()

  })

  modalEditUser.show();

  await fillFieldsEditUserForm(event, userID)


}

async function updateUser(userData) {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/customer`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: userData
  })

  const data = await response.json()

  console.log(data)

  if (data.status === 'success') {

    modalEditUser.hide();
    spinner.classList.add('d-flex')
    setTimeout(() => {

      spinner.classList.remove('d-flex')
      modalConfirm.show()

      titleModalConfirm.innerText = `SUCESSO!`
      textModalConfirm.innerText = `A alteração de usuário foi realizada com sucesso!`
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

      titleModalConfirm.innerText = `Opss!`
      textModalConfirm.innerText = `Algo inesperado aconteceu e sua solicitação não foi concluída. Tente novamente.`
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

async function fillFieldsEditUserForm(event, userID) {

  console.log('UserID editar:', userID);

  const listUsers = await getUserList();

  const user = listUsers.filter(user => user.id === userID)[0];

  user.id = userID
  user.phone = '99999999999'

  console.log('user filtrado', user);

  const userTypeList = await getListTypeCustomer();

  const selectTypeCustomer = document.getElementById('modal_type_customer');
  populateSelectTypeUser(userTypeList, 'modal_type_customer');


  for (let i = 0; i < selectTypeCustomer.options.length; i++) {
    if (selectTypeCustomer.options[i].text === user.role) {
      selectTypeCustomer.options[i].selected = true;
      break;
    }
  }

  for (let chave in user) {
    if (Object.prototype.hasOwnProperty.call(user, chave)) {
      const element = document.getElementById(`modal_${chave}`);
      if (element && chave !== 'role') {
        element.value = user[chave];
      }
    }
  }

}

async function handleDeleteClick(event, userId) {
  event.stopPropagation();
  console.log('UserID excluir:', userId);

  confirmDelete(userId)

}

async function handleResendButtonClick(event, userId, userEmail) {
  event.stopPropagation();
  console.log('Reenviar e-mail para:', userEmail, 'do userID:', userId);

  const button = event.currentTarget

  button.classList.add('disabled');
  button.setAttribute('disabled', 'true');
  button.setAttribute('data-kt-indicator', 'on')

  try {
    const resultResendEmail = await resendEmail(userEmail);

    if (resultResendEmail === "success") {
      button.removeAttribute('data-kt-indicator')
      button.textContent = 'ENVIADO';
    } else {
      button.removeAttribute('data-kt-indicator')
      button.textContent = 'TENTE NOVAMENTE';
    }
  } catch (error) {
    console.error('Erro ao reenviar e-mail:', error);
    button.textContent = 'ERRO';
  }


}

async function resendEmail(emailCustomer) {

  const dataCustomer = { email: emailCustomer };

  try {
    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/resend-email`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataCustomer)
    });

    const data = await response.json()
    return data.status

  } catch (error) {
    console.error('Erro ao enviar requisição:', error);
    throw error;
  }

}

async function getDataRegisterNewUser() {

  const formNewUser = document.getElementById('newUserForm')
  // INSTANCIANDO FORMULÁRIO
  const formData = new FormData(formNewUser)
  console.log(formData)
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
  uppercaseFormData.phone = '99999999999'

  const dataCustomer = JSON.stringify(uppercaseFormData)

  return dataCustomer

}


async function registerNewUser(newUser) {

  const spinnerRegisterUser = document.getElementById('overlay-container-newUser')
  spinnerRegisterUser.style.display = "flex"

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/customer`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: newUser,
  })

  const data = await response.json()

  if (data.status == 'success') {

    setTimeout(() => {

      registrationUserSuccess()
      spinnerRegisterUser.style.display = "none"

    }, 1500)

  } else {

    setTimeout(() => {
      spinnerRegisterUser.style.display = "none"
      registrationUserError()
    }, 1500)

  }

}

async function findLabelOrID(value) {

  const typeCustomerList = await getListTypeCustomer()

  if (typeof value === 'number') {
    const labelFinded = typeCustomerList.find(item => item.id === value);
    return labelFinded ? labelFinded.role : "Rótulo não encontrado";

  } else if (typeof value === 'string') {

    const idFinded = typeCustomerList.find(item => item.name === value);
    return idFinded ? idFinded.id : "ID não encontrado";

  } else {
    return "Indefinido";
  }
}

async function getDataForUpdateCustomer() {

  const formEditUser = document.getElementById('editUserForm')

  // INSTANCIANDO FORMULÁRIO
  const formData = new FormData(formEditUser)

  // CONVERTENDO TODOS OS VALORES PARA CAIXA ALTA
  const uppercaseFormData = {}
  for (const [key, value] of formData.entries()) {
    if (key === 'email' || key === 'password' || key === 'confirm_password') {
      uppercaseFormData[key] = value
    } else {
      uppercaseFormData[key] = value.toUpperCase()
    }
  }

  return uppercaseFormData

}


async function renderUserList(users) {

  const accordion = document.getElementById('accordion')
  accordion.innerHTML = ''
  for (const user of users) {
    const userCard = await createUserCard(user)
    accordion.innerHTML += userCard
  }

}

async function getUserList() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/list/customer/company`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  return data

}

async function deleteUser(idUser) {

  const idUserDelete = { id: idUser }

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/customer`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(idUserDelete)
  })
  const data = await response.json()
  console.log(data)
  return data

}


async function getActualTypeCustomer() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/type/customer`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  return data[0].name

}

async function getListTypeCustomer() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/list/type/customers`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  return data

}

function populateSelectTypeUser(listTypeUser, idSelect) {

  const select = document.getElementById(`${idSelect}`)

  select.innerHTML = '';

  const emptyOption = document.createElement('option')
  emptyOption.value = '';
  emptyOption.text = 'Selecione...';
  select.appendChild(emptyOption);


  listTypeUser.forEach(function (item) {

    if (item.id != 1) {

      const option = document.createElement('option')
      option.value = Number(item.id)
      option.text = item.name
      select.appendChild(option)

    }

  })

}


function registrationUserSuccess() {

  Swal.fire({
    title: 'Sucesso!',
    text: 'O cadastro de usuário foi realizado com sucesso. Enviamos ao e-mail um link para ativação da conta. O cadastro só é efetivado após essa confirmação.',
    icon: 'success',
    confirmButtonColor: '#F05742',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'btn btn-primary-confirm',
    }
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload()
    }
  })

}

function registrationUserError() {
  Swal.fire({
    title: 'Erro!',
    text: 'O cadastro de usuário não pôde ser concluído pois já existe um usuário com esse e-mail em nossa plataforma.',
    icon: 'error',
    confirmButtonColor: '#F05742',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'btn btn-primary-confirm',
    }
  });
}


function confirmDelete(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Você tem certeza que deseja excluir este usuário? Esta ação é irreversível! Deseja prosseguir?',
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

      // SPINER
      const spinnerListUser = document.getElementById('overlay-container-listUsers')

      spinnerListUser.style.display = "flex"


      const data = await deleteUser(id)

      if (data.status === "success") {

        setTimeout(() => {

          spinnerListUser.style.display = "none"
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `O usuário foi cadastrado com sucesso!`
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

        }, 500)

        setTimeout(() => {

          modalConfirm.hide()
          location.reload()

        }, 2000)

      } else {


        setTimeout(() => {

          spinnerListUser.style.display = "none"
          modalConfirm.show()

          titleModalConfirm.innerText = `Ops!`
          textModalConfirm.innerText = `Algo deu errado e sua solicitação não foi realizada. Tente novamente!`
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

    } else if (result.dismiss === Swal.DismissReason.cancel) {
      //location.reload();
    }
  });
}




async function getDetailsCustomerOn() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/details`, {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })

  const data = await response.json()

  console.log(data)

  return data[0]

}

const inputPassword = document.getElementById('password')
const inputConfirmPassword = document.querySelector('input[name="confirm_password"]')

const iconShowPassword = document.getElementById('icon-eye-closed-1')
const iconHidePassword = document.getElementById('icon-eye-open-1')

const iconShowConfirmPassword = document.getElementById('icon-eye-closed-2')
const iconHideConfirmPassword = document.getElementById('icon-eye-open-2')

function togglePasswordVisibility(event) {

  if (inputPassword.type === 'password') {
    inputPassword.type = 'text';
    iconHidePassword.classList.add('d-none');
    iconShowPassword.classList.remove('d-none');
  } else {
    inputPassword.type = 'password';
    iconShowPassword.classList.add('d-none');
    iconHidePassword.classList.remove('d-none');
  }
}

iconHidePassword.addEventListener('click', togglePasswordVisibility);
iconShowPassword.addEventListener('click', togglePasswordVisibility);

function toggleConfirmPasswordVisibility(event) {

  if (inputConfirmPassword.type === 'password') {
    inputConfirmPassword.type = 'text';
    iconHideConfirmPassword.classList.add('d-none');
    iconShowConfirmPassword.classList.remove('d-none');
  } else {
    inputConfirmPassword.type = 'password';
    iconShowConfirmPassword.classList.add('d-none');
    iconHideConfirmPassword.classList.remove('d-none');
  }
}

iconShowConfirmPassword.addEventListener('click', toggleConfirmPasswordVisibility);
iconHideConfirmPassword.addEventListener('click', toggleConfirmPasswordVisibility);

