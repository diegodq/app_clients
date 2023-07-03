const menuUserOptions = document.getElementById('menu-user')
const subMenuUser = document.getElementById('sub-menu-user')
const logoutOption = document.getElementById('submenu-logout')
const nameCustomerHeader = document.querySelector('[name="name_customer_head"]')
const positionCustomerHeader = document.querySelector('[name="position_customer_head"]')
const spinner = document.getElementById('spinner-overlay')
const subMenuOptionsSettings = document.getElementById('submenu-settings')
const subMenuOptionsBilling = document.getElementById('submenu-billing')
const subMenuOptionsOverview = document.getElementById('submenu-overview')
const menuAsideOptionsServices = document.getElementById('menu-aside-services')
const menuAsideOptionsDepartments = document.getElementById('menu-aside-departments')
const menuAsideOptionsPersonalizedQuestions = document.getElementById('menu-aside-personalized-questions')
const menuAsideOptionsAwnsweredSurvey = document.getElementById('menu-aside-answered-survey')
const menuAsideOptionsManagerSurvey = document.getElementById('menu-aside-manager-survey')
const menuAsideOptionDashboard = document.getElementById('menu-aside-dashboard')
const changeProductMenu = document.getElementById('change-product-menu')
const menuAsideMobileIcon = document.getElementById('menu-aside-mobile-icon')
const menuAsideMobileIcon2 = document.getElementById('menu-aside-mobile-icon2')
const menuAsideMobileIcon3 = document.getElementById('menu-aside-mobile-icon3')
const menuAsideMobileStart = document.getElementById('menu-aside-mobile-start')
const modalConfirm = new bootstrap.Modal(document.getElementById('alertModal'), {
    keyboard: true
})
const menuAsideRegister = document.getElementById('menu-link')




document.addEventListener('load', (event) => {

    // PREENCHENDO DADOS DE USUÁRIO NO SUB-MENU

    const tokenCustomer = localStorage.getItem('tokenCustomer')
    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/information' : configEnv.local_address + '/information', {
        headers: {
            'Authorization': `Bearer ${tokenCustomer}`
        }
    })
        .then((response) => response.json())
        .then((data) => {

            const allDataCustomer = Object.assign({}, ...data.map(item => {
                const company = item.company[0]
                delete item.company
                return Object.assign({}, item, company)
            }))

            // DADOS USER MENU HEADER

            nameCustomerHeader.innerText = allDataCustomer.first_name
            positionCustomerHeader.innerText = allDataCustomer.position
            menuUserOptions.setAttribute('src', allDataCustomer.avatar)

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

            } else {

                menuUserOptions.setAttribute('src', '/assets/media/avatars/blank.png')

            }
        })

})

logoutOption.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        spinner.classList.remove('d-flex')
        window.location.href = '/'
        localStorage.clear()

    }, 1500)

})


// ABRINDO MENU SUPERIOR
document.addEventListener('click', (event) => {

    if (event.target === menuUserOptions) {

        menuUserOptions.classList.add('show')
        menuUserOptions.classList.add('menu-dropdown')
        subMenuUser.classList.add('show')
        subMenuUser.setAttribute('style', "z-index: 105; position: fixed; inset: 0px 0px auto auto; margin: 0px; transform: translate(-30px, 65px)")


    } else {

        menuUserOptions.classList.remove('show')
        menuUserOptions.classList.remove('menu-dropdown')
        subMenuUser.classList.remove('show')
        subMenuUser.removeAttribute('style', "z-index: 105; position: fixed; inset: 0px 0px auto auto; margin: 0px; transform: translate(-30px, 65px)")

    }

})


// MOVIMENTANDO O MENU LATERAL

const menuAside = document.getElementById('kt_body')
const iconeMoveMenu = document.getElementById('menu-icon-move')

iconeMoveMenu.addEventListener('click', (event) => {

    if (menuAside.hasAttribute('data-kt-aside-minimize')) {

        menuAside.removeAttribute('data-kt-aside-minimize')
        iconeMoveMenu.classList.remove("active")


    } else {

        menuAside.setAttribute('data-kt-aside-minimize', 'on')
        iconeMoveMenu.classList.add("active")

    }

})

// MOVIMENTANDO O SUB-MENU INTERNO AO LATERAL

const subMenuSetData = document.getElementById('sub-menu-setData')
const titleSetData = document.getElementById('setData-title')


menuAsideRegister.addEventListener('click', (event) => {

    if (subMenuSetData.classList.contains('menu-active-bg')) {

        subMenuSetData.classList.remove('menu-active-bg')
        subMenuSetData.classList.add('hover')
        subMenuSetData.classList.add('show')


    } else {

        subMenuSetData.classList.add('menu-active-bg')
        subMenuSetData.classList.remove('hover')
        subMenuSetData.classList.remove('show')

    }

})

// FECHAMENTO O SUB MENU NO MENU ASIDE QUANDO MENU FECHADO

const menuAsideMoving = document.getElementById('moving-menu-aside')
menuAsideMoving.addEventListener('mouseleave', (event) => {

    if (menuAside.hasAttribute('data-kt-aside-minimize')) {

        subMenuSetData.classList.add('menu-active-bg')
        subMenuSetData.classList.remove('hover')
        subMenuSetData.classList.remove('show')

    }
})

// MOVIMENTANDO MENU MOBILE

document.addEventListener('click', (event) => {

    if (event.target === menuAsideMobileIcon || event.target === menuAsideMobileIcon2 || event.target === menuAsideMobileIcon3) {

        if (menuAsideMoving.classList.contains('drawer-on')) {

            menuAsideMobileStart.classList.remove('active')
            menuAsideMoving.classList.remove('drawer-on')
            menuAsideMoving.classList.remove('drawer')
            menuAsideMoving.classList.remove('drawer-start')
        } else {

            menuAsideMobileStart.classList.add('active')
            menuAsideMoving.classList.add('drawer-on')
            menuAsideMoving.classList.add('drawer')
            menuAsideMoving.classList.add('drawer-start')
        }
    } else if (!menuAsideMoving.contains(event.target) && menuAsideMoving.classList.contains('drawer-on')) {

        menuAsideMobileStart.classList.remove('active')
        menuAsideMoving.classList.remove('drawer-on')
        menuAsideMoving.classList.remove('drawer')
        menuAsideMoving.classList.remove('drawer-start')
    }

})

// MUDAR PRODUTO / APLICAÇÃO

changeProductMenu.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        spinner.classList.remove('d-flex')
        window.location.href = '/choice-product'

    }, 1000)

})


// NAVEGAÇÃO SUB MENU USER

subMenuOptionsSettings.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        spinner.classList.remove('d-flex')
        window.location.href = '/edit-profile-customer'

    }, 1000)


})

subMenuOptionsBilling.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        spinner.classList.remove('d-flex')
        window.location.href = '/billing'

    }, 1000)


})

subMenuOptionsOverview.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {

        spinner.classList.remove('d-flex')
        window.location.href = '/overview'

    }, 1000)

})

// NAVEGAÇÃO MENU ASIDE

menuAsideOptionsServices.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {
        spinner.classList.remove('d-flex')
        window.location.href = '/topics'

    }, 1000)

})

menuAsideOptionsDepartments.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {
        spinner.classList.remove('d-flex')
        window.location.href = '/departments'

    }, 1000)

})

menuAsideOptionsPersonalizedQuestions.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {
        spinner.classList.remove('d-flex')
        window.location.href = '/questions'

    }, 1000)

})


menuAsideOptionsManagerSurvey.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {
        spinner.classList.remove('d-flex')
        window.location.href = '/manager-survey'

    }, 1000)

})

menuAsideOptionsAwnsweredSurvey.addEventListener('click', (event) => {

    alertNoCreatedYet ()

})


menuAsideOptionDashboard.addEventListener('click', (event) => {

    spinner.classList.add('d-flex')

    setTimeout(() => {
        spinner.classList.remove('d-flex')
        window.location.href = '/dashboard'

    }, 1000)

})