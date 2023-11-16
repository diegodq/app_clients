
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

  const menuAsideOptionsManagerSurvey = document.getElementById(
    'menu-aside-manager-survey',
  );
  menuAsideOptionsManagerSurvey.addEventListener('click', (event) => {
    spinner.classList.add('d-flex');

    setTimeout(() => {
      spinner.classList.remove('d-flex');
      window.location.href = '/manager-survey';
    }, 1000);
  });

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

})

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

subMenuRegister.addEventListener('click', () => {
  const isVisible = getComputedStyle(subMenuSetData).display != 'none';
  if (isVisible) {
    subMenuSetData.style.display = 'none';
    subMenuRegister.removeAttribute('set-open');
  } else {
    subMenuSetData.style.display = 'block';
    subMenuRegister.setAttribute('set-open', 'on');
  }
});


