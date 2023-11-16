const modalRegisterQuestion = $('#modal-register-question')
const componentNameQuestion = $('#name-question-component')
const componentTextQuestion = $('#text-question-component')
const componentTypeQuestion = $('#question-type-component')
const componentBinaryQuestion = $('#question-binary-type')
const componentImportQuestion = $('#question-import')
const componentReviewQuestion = $('#question-review')
const componentTreeQuestion = $('#tree-question-component')
const buttonAdvanceNameQuestion = $('#button-advance-name-question')
const buttonAdvanceTextQuestion = $('#button-advance-text-question')
const buttonAdvanceTreeQuestion = $('#button-advance-tree-question')
const buttonAdvanceImportQuestion = $('#button-advance-import-question')
const buttonAdvanceBinaryQuestion = $('#button-advance-binary-question')
const buttonAdvanceReviewQuestion = $('#button-advance-review-question')
const buttonBackTextQuestion = $('#button-back-text-question')
const buttonBackTreeQuestion = $('#button-back-tree-question')
const buttonBackTypeQuestion = $('#button-back-type-question')
const buttonBackImportQuestion = $('#button-back-import-question')
const buttonBackBinaryQuestion = $('#button-back-binary-question')
const buttonBackReviewQuestion = $('#button-back-review-question')
const buttonRegisterAnchorQuestion = $('#button-add-anchor-question')
const buttonCancelAnchorQuestion = $('#button-cancel-anchor-question')
const formRegisterQuestion = $('#form-register-questions')
const contentAreaReviewQuestion = $('#area-review-content-question')
const fieldNoQuestion = document.getElementById('field-no-questions')
const radioOptionFreeAnswer = $('#question-free-answer-radio')
const radioOptionBinary = $('#question-binary-radio')
const radioOptionImport = $('#question-import-radio')
const buttonRegisterQuestion = $('#button-add-question')
const inputAnchorQuestion = $('#input-anchor-question')
const textAreaAnchorQuestion = $('#text-area-button-anchor-question')
const questionsTable = document.getElementById('questions_table')
const searchInput = document.getElementById('search-input')
const typesTools = ['alert', 'contact', 'finish']

window.addEventListener('load', async (event) => {

  await fillFieldsPage()

})

async function fillFieldsPage() {

  const alldataQuestions = await questionsRequest()

  if (alldataQuestions.message === 'no-questions') {

    fieldNoQuestion.innerText = 'Não há perguntas cadastradas.'

  } else {

    fieldNoQuestion.innerText = ''
    const dataQuestions = alldataQuestions.filter(element => !typesTools.includes(element.type_question))

    if (dataQuestions == '') {

        fieldNoQuestion.innerText = 'Não há ferramentas cadastradas.'

    }

    await createRows(dataQuestions)
    await listenClickActive()
    await listenClickUpdate()
    await listenClickDeleteIcon()

    

  }
  await getDataAnchorQuestion()
}
 

async function questionsRequest() {

  const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/company-questions' : configEnv.local_address + '/company-questions', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  return data

}

async function listenClickUpdate() {

  const spansUpdate = document.querySelectorAll('.btn-outline-light.rounded-pill.update')

  spansUpdate.forEach(span => {

    span.addEventListener('click', async (event) => {

      await alertNoCreatedYet()

    })
  })
}

async function createRows(data) {

  const windowWidth = window.innerWidth

  const fillFieldsTableQuestion = await data.map(async (item, index) => {
    const row = questionsTable.insertRow()
    const cells = []

    //const idQuestion = document.createElement('td')
    const nameQuestion = document.createElement('td')
    const typeQuestion = document.createElement('td')
    const treeQuestion = document.createElement('td')
    const statusQuestion = document.createElement('td')
    const optionsRow = document.createElement('td')
    cells.push(nameQuestion, typeQuestion, treeQuestion, statusQuestion, optionsRow)

    //idQuestion.innerHTML = item.id
    nameQuestion.innerHTML = item.title_question
    treeQuestion.innerHTML = item.tree_question === 1 ? await getRateTextAndIcon('POSITIVA') : await getRateTextAndIcon('NEGATIVA')
    typeQuestion.innerHTML = await labelChangeTypeQuestion(item.type_question)
    const checkedOrEmpty = item.status === 0 ? '' : 'checked'
    statusQuestion.innerHTML = `<label class="form-check form-switch form-check-custom activeReg form-check-solid">
      <input class="form-check-input" data-active=${item.status} data-id=${item.id} type="checkbox" ${checkedOrEmpty ? 'checked' : ''} />
    </label>`;
    optionsRow.innerHTML = `
      <span class="btn btn-sm btn-outline-light rounded-pill delete" data-id="${item.id}">
        <a>
          <i class="bi bi-trash bi-lg cursor-pointer" data-id="${item.id}"></i>
        </a>
      </span>
    </div>`;

    row.classList.add('text-gray-800', 'text-center')


    cells.forEach((cell) => {
      cell.style.display = 'none'
    })
    Array.from(questionsTable.querySelectorAll('th')).forEach((titleCell) => {
      titleCell.style.display = 'none'
    });


    if (windowWidth < 600) {
      const columnsToShow = [nameQuestion, statusQuestion, optionsRow]
      const columnIndicesToShow = [0, 1, 4, 5];

      columnsToShow.forEach((cell, i) => {
        cell.style.display = 'table-cell'
        row.appendChild(cell)
        questionsTable.querySelector('th:nth-child(' + (columnIndicesToShow[i] + 1) + ')').style.display = 'table-cell'
      });
    } else {
      cells.forEach((cell) => {
        cell.style.display = 'table-cell'
        row.appendChild(cell)
      });
      Array.from(questionsTable.querySelectorAll('th')).forEach((titleCell) => {
        titleCell.style.display = 'table-cell'
      })
    }

    return row
  })

}

async function listenClickActive() {

  const inputs = document.querySelectorAll('[data-active]')

  inputs.forEach(async input => {

    input.addEventListener('click', async (event) => {

      const idInputClicked = event.target.dataset.id
      const newStatus = input.checked ? '1' : '0'

      const activeOrInactive = { 'id': idInputClicked, 'new_status': newStatus }

      try {
        const response = await fetch(
          configEnv.app_mode === 'production'
            ? configEnv.web_address + '/question'
            : configEnv.local_address + '/question',
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${tokenCustomer}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(activeOrInactive)
          }
        )

      } catch (error) {
        console.error(error)
      }
    })
  })

}

// async function listenClickDeleteIcon() {

//   const spansDelete = document.querySelectorAll('.btn-outline-light.rounded-pill.delete')

//   spansDelete.forEach(span => {

//     span.addEventListener('click', async (event) => {

//       await alertNoCreatedYet()

//     })
//   })

// }

// MOVIMENTANDO AS PERGUNTAS

// NOME DA PERGUNTA PARA TEXTO DA PERGUNTA

async function componentNameToText() {

  componentNameQuestion.fadeOut(600, function () {
    componentNameQuestion.addClass('d-none')
    componentTextQuestion.removeClass('d-none')
    componentTextQuestion.fadeIn(600)
  })

  buttonBackTextQuestion.click(function () {
    componentTextQuestion.fadeOut(600, function () {
      componentTextQuestion.addClass('d-none')
      componentNameQuestion.removeClass('d-none')
      componentNameQuestion.fadeIn(600)
    })
  })


}

// TEXTO DA PERGUNTA PARA ÁRVORE DA PERGUNTA

async function componentTextToTree() {

  componentTextQuestion.fadeOut(600, function () {
    componentTextQuestion.addClass('d-none')
    componentTreeQuestion.removeClass('d-none')
    componentTreeQuestion.fadeIn(600)

  })

  buttonBackTreeQuestion.click(function () {
    componentTreeQuestion.fadeOut(600, function () {
      componentTreeQuestion.addClass('d-none')
      componentTextQuestion.removeClass('d-none')
      componentTextQuestion.fadeIn(600)
    })
  })

}

// TREE DA PERGUNTA PARA TIPO DA PERGUNTA

buttonBackTypeQuestion.click(function () {
  componentTypeQuestion.fadeOut(600, function () {
    componentTypeQuestion.addClass('d-none')
    componentTreeQuestion.removeClass('d-none')
    componentTreeQuestion.fadeIn(600)
  })
})

const radioTree = document.querySelectorAll('[data-tree]')
radioTree.forEach(input => {
  input.addEventListener('click', () => {

    componentTreeQuestion.fadeOut(600, function () {
      componentTreeQuestion.addClass('d-none')
      componentTypeQuestion.removeClass('d-none')
      componentTypeQuestion.fadeIn(600)
    })

  })

})

// TIPO DA PERGUNTA PARA O CAMINHO ESCOLHIDO

const radioInputsType = document.querySelectorAll('[data-radio]')

// GERENCIANDO MARCAÇÃO DE TYPE E DEFININDO CAMINHO

radioInputsType.forEach(async input => {

  input.addEventListener('click', async () => {
    radioInputsType.forEach(async otherInput => {
      if (otherInput !== input) {
        otherInput.checked = false
        otherInput.disabled = true
      }
    })

    await resetDataWhenTypeChoiced()
    await choiceWayQuestion(input)

  })
})

// GERENCIANDO MARCAÇÃO DE INPUT RADIO IMPORT

$(document).ready(function () {
  $('input[name="import-departments"]').change(function () {
    if ($(this).is(':checked')) {
      $('input[name="import-topics"]').prop('checked', false)
    }
  })

  $('input[name="import-topics"]').change(function () {
    if ($(this).is(':checked')) {
      $('input[name="import-departments"]').prop('checked', false)
    }
  })
})

// FUNÇÕES AUXILIARES

async function labelChangeTypeQuestion(type) {
  switch (type) {
    case 'import':
      return 'IMPORTAR'
    case 'input':
      return 'CAMPO LIVRE'
    case 'binary':
      return 'BINÁRIA'
    default:
      return 'Opção inválida'
  }
}

async function getDataQuestion() {
  return {
    'title_question': $('#input-name-question').val(),
    'question_description': $('#input-question').val(),
    'tree_question': Array.from(radioTree).filter(radio => radio.checked === true).map(radio => radio.dataset.tree)[0],
    'type_question': Array.from(radioInputsType).filter(radio => radio.checked === true).map(radio => radio.dataset.radio)[0],
    'status': 1,
  }
}

async function getDataParamsQuestion() {

  return [{
    'option_one': $('#input-binary-1').val() == undefined ? '' : $('#input-binary-1').val(),
    'option_two': $('#input-binary-2').val() == undefined ? '' : $('#input-binary-2').val(),
    'import_type': await wichInputIsSelected($('input.input-checkbox-import'))
  }]

}

async function resetDataWhenTypeChoiced() {

  $('#input-binary-1').val('')
  $('#input-binary-2').val('')
  $('input[name="import-departments"]').prop('checked', false)
  $('input[name="import-topics"]').prop('checked', false)
  buttonAdvanceReviewQuestion.off('click')

}

async function choiceWayQuestion(typeInput) {

  if (typeInput.dataset.radio === 'import') {

    componentTypeQuestion.fadeOut(600, function () {
      componentTypeQuestion.addClass('d-none')
      componentImportQuestion.removeClass('d-none')
      componentImportQuestion.fadeIn(600)
    })


    buttonAdvanceImportQuestion.click(function () {
      componentImportQuestion.fadeOut(600, async function () {
        componentImportQuestion.addClass('d-none')
        componentReviewQuestion.removeClass('d-none')
        componentReviewQuestion.fadeIn(600)

        const dataQuestion = await getDataQuestion()

        const importTopic = dataQuestion == 'on' ? 'Imp. Tópicos Avaliáveis' : 'Imp. Departamentos'

        contentAreaReviewQuestion.empty()
        contentAreaReviewQuestion.append(`<span class="fw-bolder">Nome da Pergunta: </span> ${dataQuestion.title_question}<br>`)
        contentAreaReviewQuestion.append(`<strong>Pergunta:</strong> ${dataQuestion.question_description}<br>`)
        contentAreaReviewQuestion.append(`<strong>Tipo da Pergunta:</strong> ${await labelChangeTypeQuestion(dataQuestion.type_question)} | ${importTopic} <br>`)

      })

    })

    buttonBackImportQuestion.click(function () {
      componentImportQuestion.fadeOut(600, async function () {
        componentImportQuestion.addClass('d-none')
        componentTypeQuestion.removeClass('d-none')
        componentTypeQuestion.fadeIn(600)
        await turnOnButtonTypes()
      })
    })

    buttonBackReviewQuestion.off('click')
    buttonBackReviewQuestion.click(async function () {
      await manageButtonBackReview(typeInput)
    })

    buttonAdvanceReviewQuestion.off('click')
    buttonAdvanceReviewQuestion.click(async function () {

      componentReviewQuestion.addClass('d-none')
      componentReviewQuestion.fadeOut(500)
      await registerQuestion(JSON.stringify(await getDataQuestion()))

    })


  } else if (typeInput.dataset.radio === 'binary') {


    componentTypeQuestion.fadeOut(600, function () {
      componentTypeQuestion.addClass('d-none')
      componentBinaryQuestion.removeClass('d-none')
      componentBinaryQuestion.fadeIn(600)
    })


    buttonBackBinaryQuestion.click(function () {
      componentBinaryQuestion.fadeOut(600, async function () {
        componentBinaryQuestion.addClass('d-none')
        componentTypeQuestion.removeClass('d-none')
        componentTypeQuestion.fadeIn(600)
        await turnOnButtonTypes()
      })
    })

    buttonAdvanceReviewQuestion.off('click')
    buttonAdvanceReviewQuestion.click(async function () {

      componentReviewQuestion.addClass('d-none')
      componentReviewQuestion.fadeOut(500)
      await registerQuestion(JSON.stringify(await getDataQuestion()))

    })

    buttonBackReviewQuestion.off('click')
    buttonBackReviewQuestion.click(async function () {
      await manageButtonBackReview(typeInput)
    })


  } else {

    componentTypeQuestion.fadeOut(600, function () {
      componentTypeQuestion.addClass('d-none')
      componentReviewQuestion.removeClass('d-none')
      componentReviewQuestion.fadeIn(600)
    })


    buttonBackReviewQuestion.off('click')
    buttonBackReviewQuestion.click(async function () {
      await manageButtonBackReview(typeInput);
    });

    buttonAdvanceReviewQuestion.off('click')
    buttonAdvanceReviewQuestion.click(async function () {

      componentReviewQuestion.addClass('d-none')
      componentReviewQuestion.fadeOut(500)
      await registerQuestion(JSON.stringify(await getDataQuestion()))



    })

    const dataQuestion = await getDataQuestion()

    contentAreaReviewQuestion.empty()
    contentAreaReviewQuestion.append(`<span class="fw-bolder">Nome da Pergunta: </span> ${dataQuestion.title_question}<br>`)
    contentAreaReviewQuestion.append(`<strong>Pergunta:</strong> ${dataQuestion.question_description}<br>`)
    contentAreaReviewQuestion.append(`<strong>Tipo da Pergunta:</strong> ${await labelChangeTypeQuestion(dataQuestion.type_question)}<br>`)

  }
}

async function manageButtonBackReview(typeInput) {

  if (typeInput.dataset.radio === 'binary') {

    componentReviewQuestion.fadeOut(600, function () {
      componentReviewQuestion.addClass('d-none')
      componentBinaryQuestion.removeClass('d-none')
      componentBinaryQuestion.fadeIn(600)
    })

  } else if (typeInput.dataset.radio === 'import') {

    componentReviewQuestion.fadeOut(600, function () {
      componentReviewQuestion.addClass('d-none')
      componentImportQuestion.removeClass('d-none')
      componentImportQuestion.fadeIn(600)
    })

  } else {

    componentReviewQuestion.fadeOut(600, async function () {
      componentReviewQuestion.addClass('d-none')
      componentTypeQuestion.removeClass('d-none')
      componentTypeQuestion.fadeIn(600)
      await turnOnButtonTypes()
    })

  }

}

async function turnOnButtonTypes() {
  radioInputsType.forEach(input => {

    input.disabled = false

  })

}

async function wichInputIsSelected(inputs) {

  let checkedInput = null

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      checkedInput = inputs[i].id
      break
    }
  }

  return checkedInput || ''

}

async function registerQuestion(dataForm) {

  const paramsQuestion = await getDataParamsQuestion()

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/question' : configEnv.local_address + '/question', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataForm
  }).then(response => response.json()).then(async data => {

    if (data.status === 'success') {

      const registerParmsQuestionsIsOk = await registerParamsQuestion(paramsQuestion, data.questionCreated.questionId)

      if (registerParmsQuestionsIsOk) {

        await notifyRegisterQuestion(data)

      } else {

        await notifyRegisterQuestion({ status: 'warn' })

      }


    }

  })

}

async function registerParamsQuestion(dataForm, idQuestion) {

  dataForm[0].question = idQuestion

  const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/params/question' : configEnv.local_address + '/params/question', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataForm)
  });

  const data = await response.json()
  const trueOrFalse = data.status === 'success' ? true : false

  return trueOrFalse

}

async function notifyRegisterQuestion(data) {

  if (data.status === 'success') {

    spinner.classList.add('d-flex')
    setTimeout(() => {

      spinner.classList.remove('d-flex')
      modalConfirm.show()

      titleModalConfirm.innerText = `SUCESSO!`
      textModalConfirm.innerText = `Sua pergunta foi cadastrado com sucesso!`
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

  } else if (data.message === 'Esta pergunta já está cadastrada.') {

    spinner.classList.add('d-flex')

    setTimeout(() => {

      spinner.classList.remove('d-flex')
      modalConfirm.show()

      titleModalConfirm.innerText = `Ops, essa já existe!`
      textModalConfirm.innerText = `Já existe uma pergunta com esse texto. Tente uma diferente.`
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
      location.reload()

    }, 2500)
  }
}

async function getProduct() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/product/company`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  return await data.products[0].id

}

async function getDataAnchorQuestion() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/anchor-question`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  if (data.message === 'no-anchor-question') {
    inputAnchorQuestion.val('')
  } else {
    inputAnchorQuestion.val(data.message)
    await managerAnchorQuestion()
  }

  return data

}

async function getParamQuestion(IdQuestion) {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/question/${IdQuestion}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())

}

async function managerAnchorQuestion() {

  if (inputAnchorQuestion.val() === '') {

    buttonCancelAnchorQuestion.hide()

  } else {

    buttonRegisterAnchorQuestion.hide()
    buttonCancelAnchorQuestion.hide()
    const linkEditQuestion = $("<a>", {
      text: "Editar",
      href: "javascript:void(0)",
      click: async function () {
        inputAnchorQuestion.prop('disabled', false)
        textAreaAnchorQuestion.hide()
        buttonRegisterAnchorQuestion[0].textContent = 'ALTERAR'
        buttonRegisterAnchorQuestion.show()
        buttonCancelAnchorQuestion.show()
        buttonCancelAnchorQuestion.on('click', await reloadPageCancel)
      }
    })

    textAreaAnchorQuestion.append(linkEditQuestion)
    inputAnchorQuestion.prop('disabled', true)

  }

}

async function registerAnchorQuestion(anchorQuestionInputValue) {

  const anchorQuestion = await getDataAnchorQuestion()

  const dataAnchorQuestion = { anchor_question: anchorQuestionInputValue }


  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/anchor-question' : configEnv.local_address + '/anchor-question', {
    method: `PATCH`,
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataAnchorQuestion)
  })
    .then(response => response.json())
    .then(data => {

      if (data.status === 'success' & buttonRegisterAnchorQuestion[0].textContent === 'ALTERAR') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          modalConfirm.show()

          titleModalConfirm.innerText = `SUCESSO!`
          textModalConfirm.innerText = `A pergunta âncora foi alterada com sucesso!`
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

        if (data.status === 'success') {

          spinner.classList.add('d-flex')
          setTimeout(() => {

            spinner.classList.remove('d-flex')
            modalConfirm.show()

            titleModalConfirm.innerText = `SUCESSO!`
            textModalConfirm.innerText = `A pergunta âncora foi cadastrada com sucesso!`
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
      }

    })
}

async function reloadPageCancel() {
  location.reload()
}

async function binaryCoponentToReview() {

  componentBinaryQuestion.fadeOut(600, async function () {
    componentBinaryQuestion.addClass('d-none')
    componentReviewQuestion.removeClass('d-none')
    componentReviewQuestion.fadeIn(600)

    const dataQuestion = await getDataQuestion()
    const dataParamsQuestion = await getDataParamsQuestion()

    contentAreaReviewQuestion.empty()
    contentAreaReviewQuestion.append(`<span class="fw-bolder">Nome da Pergunta: </span> ${dataQuestion.title_question}<br>`)
    contentAreaReviewQuestion.append(`<strong>Pergunta:</strong> ${dataQuestion.question_description} | 01: ${dataParamsQuestion[0].option_one} - 02: ${dataParamsQuestion[0].option_two} <br>`)
    contentAreaReviewQuestion.append(`<strong>Tipo da Pergunta:</strong> ${await labelChangeTypeQuestion(dataQuestion.type_question)}`)
  })

}

// CAMPO DE BUSCA DA PÁGINA

searchInput.addEventListener('keyup', function (event) {
  const searchValue = event.target.value.toLowerCase();
  const rows = Array.from(questionsTable.getElementsByTagName('tr'));

  rows.forEach((row, index) => {

    if (index === 0) return

    const found = Array.from(row.getElementsByTagName('td')).some((cell) => {
      const text = cell.textContent.toLowerCase()
      return text.includes(searchValue)
    })

    row.style.display = found ? '' : 'none'

  })
})


async function getRateTextAndIcon(label) {

  if (label === 'POSITIVA') {
    return 'Positiva <i class="bi bi-hand-thumbs-up text-success"></i>';
  } else {
    return 'Negativa <i class="bi bi-hand-thumbs-down text-danger"></i>';
  }

}

async function listenClickDeleteIcon() {

  const spans = document.querySelectorAll('.btn-outline-light.rounded-pill.delete')

  spans.forEach(span => {
    span.addEventListener('click', (event) => {

      deleteConfirm(span.dataset.id)
    })
  })
}

async function deleteQuestion(questionId) {

  const dataQuestionDelete = { id: questionId }

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/question' : configEnv.local_address + '/question', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataQuestionDelete)
  }).then(response => response.json()).then(data => {

    if (data.status === 'success') {

      spinner.classList.add('d-flex')

      setTimeout(() => {

        spinner.classList.remove('d-flex')
        modalConfirm.show()

        titleModalConfirm.innerText = `SUCESSO!`
        textModalConfirm.innerText = `A pergunta selecionada foi excluída.`
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

      }, 1000);

      setTimeout(() => {

        modalConfirm.hide()
        location.reload()

      }, 3000)

    } else {

      spinner.classList.add('d-flex')
      setTimeout(() => {

        spinner.classList.remove('d-flex')
        modalConfirm.show()

        titleModalConfirm.innerText = `FALHA`
        textModalConfirm.innerText = `Algo deu errado e a pergunta selecionada não foi excluída conforme sua solicitação. Tente novamente!`
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

function deleteConfirm(idQuestion) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Você tem certeza que deseja excluir a pergunta selecionada? Todas as respostas dessa pergunta também serão excluídas. Deseja prosseguir?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F05742',
    cancelButtonColor: 'transparent',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn btn-primary-confirm',
      cancelButton: 'btn btn-light btn-active-light-primary'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      deleteQuestion(idQuestion)
    }
  });
}
