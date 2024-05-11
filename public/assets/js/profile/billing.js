const nameAndSurnameFieldProfile = document.getElementById('name-surname-profile-overview')
const fantasyNameCompanyFieldProfile = document.getElementById('company-name-profile-overview')
const positionFieldProfile = document.getElementById('position-profile-overview')
const emailFieldProfile = document.getElementById('email-profile-overview')
const avatarCustomer = document.getElementById('avatar-customer')
const overviewOptionMenu = document.getElementById('overview-menu')
const editProfileOptionMenu = document.getElementById('edit-profile-menu')
const billingOptionMenu = document.getElementById('billing-menu')
const servicesOptionMenu = document.getElementById('choice-product')
const usersOptionMenu = document.getElementById('users-menu')


window.addEventListener('load', (event) => {


  if (!localStorage.tokenCustomer ) {
    window.location.href = '/'
  }

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
        headers: {
          'Authorization': `Bearer ${tokenCustomer}`
        }
    })
    .then((response) => response.json())
    .then((data) => {

      console.log(data)

     // ATUALIZA OS DADOS DO HEADER MENU

		nameCustomerHeader.innerText = data.first_name;
		positionCustomerHeader.innerText = data.position;

    // HEADER PROFILE USER

    nameAndSurnameFieldProfile.innerText = `${data.first_name} ${data.surname}`
    emailFieldProfile.innerText = data.email
    positionFieldProfile.innerText = data.position
    fantasyNameCompanyFieldProfile.innerText = data.fantasy_name

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

usersOptionMenu.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {

      window.location.href = '/users'

  }, 1000)

})
