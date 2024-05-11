
window.addEventListener('load', async (event) => {
  // OPÇÕES SUB MENU CADASTRO

  const menuAsideOptionsServices = document.getElementById('menu-aside-services');
  menuAsideOptionsServices.addEventListener('click', (event) => {
    spinner.classList.add('d-flex');

    setTimeout(() => {
      spinner.classList.remove('d-flex');
      window.location.href = '/topics';
    }, 1000);
  });

  const menuAsideOptionsDepartments = document.getElementById(
    'menu-aside-departments',
  );
  menuAsideOptionsDepartments.addEventListener('click', (event) => {
    spinner.classList.add('d-flex');

    setTimeout(() => {
      spinner.classList.remove('d-flex');
      window.location.href = '/departments';
    }, 1000);
  });

  const menuAsideOptionsPersonalizedQuestions = document.getElementById(
    'menu-aside-personalized-questions',
  );

  menuAsideOptionsPersonalizedQuestions.addEventListener('click', (event) => {
    spinner.classList.add('d-flex');

    setTimeout(() => {
      spinner.classList.remove('d-flex');
      window.location.href = '/questions';
    }, 1000);
  });

  const menuAsideOptionsTools = document.getElementById('menu-aside-tools');
  menuAsideOptionsTools.addEventListener('click', (event) => {
    spinner.classList.add('d-flex');

    setTimeout(() => {
      spinner.classList.remove('d-flex');
      window.location.href = '/tools-survey';
    }, 1000);
  });


  const allowMultiStore = await multiStoreAvailable()
  const menuAsideOptionsStores = document.getElementById('menu-aside-stores');

  if (allowMultiStore) {

    menuAsideOptionsStores.addEventListener('click', (event) => {
      spinner.classList.add('d-flex');

      setTimeout(() => {
        spinner.classList.remove('d-flex');
        window.location.href = '/stores';
      }, 1000)
    });

  } else {

    menuAsideOptionsStores.classList.add('disabled-option')
  }

  // OPÇÃO MENU GESTÃO DE PESQUISA

  menuAsideOptionsManagerSurvey.addEventListener('click', addClickEventManagerSurvey)



  // OPÇÃO MENU PESQUISAS RESPONDIDAS

  const menuAsideOptionsAwnsweredSurvey = document.getElementById(
    'menu-aside-answered-survey',
  );
  menuAsideOptionsAwnsweredSurvey.addEventListener('click', (event) => {
    spinner.classList.add('d-flex');

    setTimeout(() => {
      spinner.classList.remove('d-flex');
      window.location.href = '/answers';
    }, 1000);
  });

  // OPÇÃO MENU DASHBOARD

  const menuAsideOptionDashboard = document.getElementById(
    'menu-aside-dashboard',
  );
  menuAsideOptionDashboard.addEventListener('click', (event) => {
    spinner.classList.add('d-flex');

    setTimeout(() => {
      spinner.classList.remove('d-flex');
      window.location.href = '/dashboard';
    }, 1000);
  });


  const typeCustomer = await verifyTypeUser()
  await customerPermissionApply(typeCustomer)

})

const menuAsideOptionsManagerSurvey = document.getElementById('menu-aside-manager-survey');

function addClickEventManagerSurvey() {

  spinner.classList.add('d-flex');

  setTimeout(() => {
    spinner.classList.remove('d-flex');
    window.location.href = '/manager-survey';
  }, 1000);

}

// TRAVANDO O MENU LATERAL CLICK ROTATE E MOVIMENTANDO O BODY
const chevronDoubleRight = document.querySelector('.bi-chevron-double-right');
const asideMenu = document.querySelector('.asideMenu');
const logo = document.querySelector('.logo');
const titleProduct = document.querySelector('.titleProduct');
const titleLinks = document.querySelectorAll('.titleLinks');
const biChevronRight = document.querySelector('.bi-chevron-right');
const subLIs = document.querySelectorAll('.subLIs');

chevronDoubleRight.addEventListener('click', function () {
  this.classList.toggle('rotate');
  asideMenu.classList.toggle('placeAsideMenu');

  for (let item of titleLinks) {
    if (item.getAttribute('style')) item.removeAttribute('style');
    else item.style.display = 'block';
  }

  if (logo.getAttribute('style') && titleProduct.getAttribute('style') && biChevronRight.getAttribute('style')) {
    logo.removeAttribute('style');
    titleProduct.removeAttribute('style');
    biChevronRight.removeAttribute('style');
    document.body.setAttribute('data-kt-aside-minimize', 'on')
  } else {
    logo.style.display = 'block';
    titleProduct.style.display = 'block';
    biChevronRight.style.display = 'block';
    document.body.removeAttribute('data-kt-aside-minimize', 'on')
  }
});

asideMenu.addEventListener('mouseleave', () => {
  if (subMenuRegister.getAttribute('set-open'))
    subMenuRegister.click();
});

// ABRINDO E FECHANDO SUBMENU DE CADASTRO

const subMenuRegister = document.getElementById('subMenuRegister');
const subMenuSetData = document.getElementById('sub-menu-setData');

subMenuRegister.addEventListener('click', managerSubMenuOpening)

function managerSubMenuOpening() {

  const isVisible = getComputedStyle(subMenuSetData).display != 'none';

  if (isVisible) {
    subMenuSetData.style.display = 'none';
    subMenuRegister.removeAttribute('set-open');
  } else {
    subMenuSetData.style.display = 'block';
    subMenuRegister.setAttribute('set-open', 'on');
  }


}


async function verifyTypeUser() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/type/customer`, {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })

  const data = await response.json()
  console.log(data)
  return data[0].name

}


async function customerPermissionApply(typeCustomer) {

  if (typeCustomer === 'USUÁRIO') {

    // DESABILITANDO OPÇÕES DE MENU
    subMenuRegister.classList.add('disabled-option')
    menuAsideOptionsManagerSurvey.classList.add('disabled-option')


    subMenuRegister.removeEventListener('click', managerSubMenuOpening)
    menuAsideOptionsManagerSurvey.removeEventListener('click', addClickEventManagerSurvey)

    // DESABILITANDO OPÇÕES DE COMPANY NA EDIT-PROFILE-CUSTOMER

    const formEditCompany = document.getElementById('edit-company-form')
    if (formEditCompany) {

      const inputs = formEditCompany.getElementsByTagName("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }

    }

    // DESABILITANDO ÁREA DE USUÁRIO
    const usersMenu = document.getElementById('users-menu')

    if (usersMenu) {

      const verifyClassActiveUsers = usersMenu.classList.contains("active")
      
      if (usersMenu && !verifyClassActiveUsers) {
  
        console.log('tem user menu')
        usersMenu.classList.add('disabled-option')
  
        usersMenu.removeEventListener('click', addClickEventUsersManager)
  
      }
    }

    const userPageComponent = document.getElementById('list_users')
    const departmentComponent = document.getElementById('departments_table')
    const questionComponent = document.getElementById('questions_table')
    const storesComponent = document.getElementById('stores_table')
    const toolsComponent = document.getElementById('tools_table')
    const topicsComponent = document.getElementById('topics_table')
    const managerSurveyComponent = document.getElementById('svg-container')


    if (userPageComponent || departmentComponent || questionComponent || storesComponent || toolsComponent || topicsComponent || managerSurveyComponent) {

      spinner.classList.add('d-flex')

      setTimeout(() => {

        window.location.href = '/'

      }, 1000)

    }

  

  }


}
