function alertNoCreatedYet () {

    spinner.classList.add('d-flex')

    setTimeout(() => {

      spinner.classList.remove('d-flex')
      modalConfirm.show()

      titleModalConfirm.innerText = `AINDA NÃO!`
      textModalConfirm.innerText = `ESSA AÇÃO AINDA NÃO FOI IMPLEMENTADA.`
      iconModalConfirm.innerHTML = `
      
      <span class="svg-icon svg-icon-success svg-icon-5hx ">
      <svg viewBox="0 0 120 120" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#6BCB77;} .st1{fill:#E8E9EA;} .st2{fill:#4D96FF;} </style> <g> <path class="st0" d="M66.7,31.5c-0.2-0.8,0-1.7,0.6-2.3l11.6-11.6c0.6-0.6,1.5-0.8,2.3-0.6l8.2,2.2l-9.3,9.3 c-0.6,0.6-0.8,1.5-0.6,2.3l1.7,6.4c0.2,0.8,0.9,1.5,1.7,1.7l6.4,1.7c0.8,0.2,1.7,0,2.3-0.6l9.3-9.3l2.2,8.2c0.2,0.8,0,1.7-0.6,2.3 L90.8,52.7c-0.6,0.6-1.5,0.8-2.3,0.6l-9.6-2.6L50.8,78.9l2.6,9.6c0.2,0.8,0,1.7-0.6,2.3l-11.6,11.6c-0.6,0.6-1.5,0.8-2.3,0.6 l-8.2-2.2l9.3-9.3c0.6-0.6,0.8-1.5,0.6-2.3l-1.7-6.4c-0.2-0.8-0.9-1.5-1.7-1.7l-6.4-1.7c-0.8-0.2-1.7,0-2.3,0.6l-9.3,9.3L17,81.2 c-0.2-0.8,0-1.7,0.6-2.3l11.6-11.6c0.6-0.6,1.5-0.8,2.3-0.6l9.6,2.6l28.1-28.1L66.7,31.5z"></path> <g> <polygon class="st1" points="102.4,98.1 98.1,102.4 92.5,99.3 91,95.4 56.2,60.6 60.6,56.2 95.3,90.9 99.2,92.4 "></polygon> <path class="st2" d="M55.9,42.4L31.5,18c-0.6-0.6-1.6-0.5-2.3,0.1L18.1,29.2c-0.7,0.7-0.7,1.7-0.1,2.3l24.4,24.4 c0.6,0.6,1.6,0.5,2.3-0.1h0c0.7-0.7,1.7-0.7,2.3-0.1l0.6,0.6c0.6,0.6,0.5,1.6-0.1,2.3l0,0c-0.7,0.7-0.7,1.7-0.1,2.3l5.9,5.9 c0.6,0.6,1.6,0.5,2.3-0.1l11.1-11.1c0.7-0.7,0.7-1.7,0.1-2.3l-5.9-5.9c-0.6-0.6-1.6-0.5-2.3,0.1l0,0c-0.7,0.7-1.7,0.7-2.3,0.1 L55.6,47c-0.6-0.6-0.5-1.6,0.1-2.3l0,0C56.4,44,56.5,43,55.9,42.4z"></path> </g> </g> </g></svg>
      </span>
      `

    }, 500);

    setTimeout(() => {

      modalConfirm.hide()
      location.reload()

    }, 3000)


}

const titleModalConfirm = document.getElementById('title-modal-confirm')
const textModalConfirm = document.getElementById('text-modal-confirm')
const iconModalConfirm = document.getElementById('icon-modal-confirm')

