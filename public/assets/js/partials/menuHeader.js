const tokenCustomer = localStorage.getItem('tokenCustomer');
const spinner = document.getElementById('spinner-overlay');
const menuUserOptions = document.getElementById('menu-user');
const menuRight = document.getElementById('menuRight');
const menuHidden = document.getElementById('menuHidden');

const modalConfirm = new bootstrap.Modal(document.getElementById('alertModal'), {
  keyboard: true
})

window.addEventListener('load', () => {
	this.showHideMenu();

  function handleConnectionError() {
    Swal.fire({
      title: 'Oopss...',
      text: 'Sua conexão excedeu o tempo limite e você precisará fazer login novamente. #voltaLogo',
      icon: 'warning',
      confirmButtonColor: '#F05742',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary-confirm',
      }
    }).then(() => {
      spinner.classList.add('d-flex');
      setTimeout(() => {
        spinner.classList.remove('d-flex');
        dropCustomer();
      }, 500);
    });
    dropCustomer();
    localStorage.clear();
  }

  function dropCustomer() {
    spinner.classList.add('d-flex');
    setTimeout(() => {
      spinner.classList.remove('d-flex');
      localStorage.clear();
      window.location.href = '/';
    }, 800);
  }

  const apiUrl = configEnv.app_mode === 'production' ? configEnv.web_address : configEnv.local_address;

  if (!tokenCustomer) {
    dropCustomer();
    return;
  }

  fetch(`${apiUrl}/has-company`, {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Acesso não autorizado.') {
        handleConnectionError();
      } else if (data.message === 'no-company') {
        Swal.fire({
          title: 'Espera um minuto...',
          text: 'Identificamos que você ainda não concluiu seu cadastro e isso é necessário para prosseguirmos. Iremos te encaminhar para que insira os dados que ainda estão pendentes.',
          icon: 'warning',
          confirmButtonColor: '#F05742',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary-confirm',
          }
        }).then(() => {
          spinner.classList.add('d-flex');
          setTimeout(() => {
            spinner.classList.remove('d-flex');
            window.location.href = '/sign-up-company';
          }, 500);
        });
      }
    })
    .catch(() => {
      handleConnectionError();
    });
})

function showHideMenu() {
	menuRight.addEventListener('mouseover', () => {
		menuHidden.classList.add('showMenuHidden');
	});

	menuHidden.addEventListener('mouseout', () => {
		menuHidden.classList.remove('showMenuHidden');
	})
}

// MUDAR PRODUTO / APLICAÇÃO
const changeProductMenu = document.getElementById('change-product-menu')
changeProductMenu.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {

    spinner.classList.remove('d-flex')
    window.location.href = '/choice-product'

  }, 1000)

})

// SETANDO NOME E AVATAR
const nameCustomerHeader = document.getElementById('userName');
const positionCustomerHeader = document.getElementById('position_customer_head');

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
    nameCustomerHeader.innerText = data[0].first_name
    positionCustomerHeader.innerText = data[0].position
  });

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/avatar' : configEnv.local_address + '/avatar', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.avatar) {
      menuUserOptions.setAttribute('src', data.avatar);
    } else {
      menuUserOptions.setAttribute('src', '/assets/media/avatars/blank.png');
    }
  }).catch(error => console.log(error));
})

// MENU DE USUÁRIO

const subMenuOptionsSettings = document.getElementById('submenu-settings')
subMenuOptionsSettings.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {

    spinner.classList.remove('d-flex')
    window.location.href = '/edit-profile-customer'

  }, 1000)


})

const subMenuOptionsBilling = document.getElementById('submenu-billing')
subMenuOptionsBilling.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {

    spinner.classList.remove('d-flex')
    window.location.href = '/billing'

  }, 1000)


})


const subMenuOptionsOverview = document.getElementById('submenu-overview')
subMenuOptionsOverview.addEventListener('click', (event) => {

  spinner.classList.add('d-flex')

  setTimeout(() => {

    spinner.classList.remove('d-flex')
    window.location.href = '/overview'

  }, 1000)

})

const logoutOption = document.getElementById('submenu-logout')
logoutOption.addEventListener('click', (event) => {
  spinner.classList.add('d-flex')

  setTimeout(() => {
    spinner.classList.remove('d-flex');
    window.location.href = '/';
    localStorage.clear();
  }, 1500);
});

// GERENCIANDO ABERTURA DE MENU ASIDE NO MOBILE
const menuAsideMobileStart = document.getElementById('menu-aside-mobile-start')

menuAsideMobileStart.addEventListener('click', (event) => {

  asideMenu.classList.add('placeAsideMenu')
  asideMenu.classList.add('showAsideMenu')
  const subLisMenu = document.querySelectorAll('[id="subLisMenu"]')

  for (let item of titleLinks) {
    item.style.display = 'block'
    item.style.fontSize = '17px';
    for (let subitem of subLisMenu) {
      subitem.style.fontSize = '15px';
    }
  }
  biChevronRight.style.display = 'block'
  biChevronRight.style.fontSize = '30px'
  logo.style.display = 'block'
  titleProduct.style.display = 'block'
  chevronDoubleRight.style.display = 'none'

  document.addEventListener('click', checkClickOutside)

})

function checkClickOutside(event) {

  if (asideMenu.classList.contains('placeAsideMenu') && asideMenu.classList.contains('showAsideMenu') && !asideMenu.contains(event.target) && !menuAsideMobileStart.contains(event.target)) {
    asideMenu.classList.remove('showAsideMenu');
    asideMenu.classList.remove('placeAsideMenu');
    for (let item of titleLinks) {
      item.style.display = 'none';
    }
    logo.style.display = 'none';
    titleProduct.style.display = 'none';
    document.removeEventListener('click', checkClickOutside);
  }
}

async function multiStoreAvailable() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/multi-store`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
    }
  })

  const data = await response.json()

  return data

}
