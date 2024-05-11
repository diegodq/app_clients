const modalRegisterQuestion = $('#modal-register-question')
const componentNameQuestion = $('#name-question-component')
const componentTextQuestion = $('#text-question-component')
const componentTypeQuestion = $('#question-type-component')
const componentBinaryQuestion = $('#question-binary-type')
const componentFlexQuestion = $('#question-flex-type')
const componentImportQuestion = $('#question-import')
const componentReviewQuestion = $('#question-review')
const componentTreeQuestion = $('#tree-question-component')
const buttonAdvanceNameQuestion = $('#button-advance-name-question')
const buttonAdvanceTextQuestion = $('#button-advance-text-question')
const buttonAdvanceTreeQuestion = $('#button-advance-tree-question')
const buttonAdvanceImportQuestion = $('#button-advance-import-question')
const buttonAdvanceBinaryQuestion = $('#button-advance-binary-question')
const buttonAdvanceFlexQuestion = $('#button-advance-flex-question')
const buttonAdvanceReviewQuestion = $('#button-advance-review-question')
const buttonBackTextQuestion = $('#button-back-text-question')
const buttonBackTreeQuestion = $('#button-back-tree-question')
const buttonBackTypeQuestion = $('#button-back-type-question')
const buttonBackImportQuestion = $('#button-back-import-question')
const buttonBackBinaryQuestion = $('#button-back-binary-question')
const buttonBackFlexQuestion = $('#button-back-flex-question')
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

      fieldNoQuestion.innerText = 'Não há perguntas cadastradas.'

    }

    await createRows(dataQuestions)
    await listenClickActive()
    await listenClickEnableMultiply()
    await listenClickDeleteIcon()



  }
  await getDataAnchorQuestion()
}


async function questionsRequest() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/company-questions`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  return data

}

async function makeRowQuestion(question) {
  const deleteIcon = `<i class="fas fa-trash-alt fa-1x" style="color: #F05742; cursor: pointer;" onclick="handleDeleteClick(event, ${question.id})" title="Excluir"></i>`;
  const activeFieldCheckedOrEmpty = question.status === 0 ? '' : 'checked';
  const multipleQuestionsFieldCheckedOrEmpty = question.multiply_questions === 0 || question.research_title === null ? '' : 'checked';

  const positiveOrNegative = await getRateTextAndIcon(question.tree_question)

  return `
    <div class="card border rounded mb-3">
      <div class="card-header cursor-pointer d-flex align-items-center" id="heading${question.id}" data-toggle="collapse" data-target="#collapse${question.id}" aria-expanded="true" aria-controls="collapse${question.id}" style="font-size: 24px; position: relative;">
        
        <button class="btn btn-link text-decoration-none">
          <span style="font-size: 20px;"> - ${question.title_question}</span>
        </button>
        
        <div class="d-flex align-items-center">
          <span style="font-size: 13px;">${positiveOrNegative}</span>
          <label class="form-check form-switch form-check-custom activeReg form-check-solid m-5"> 
            <span class="m-3" style="font-size: 13px;"> Status </span>     
            <input class="form-check-input" data-active="${question.status}" data-id="${question.id}" type="checkbox" ${activeFieldCheckedOrEmpty ? 'checked' : ''} onclick="handleCheckboxClick(event)" />
          </label>
          ${deleteIcon}
        </div>
      </div>
      <div class="collapse" id="collapse${question.id}" aria-labelledby="heading${question.id}">
        <div class="card-body" style="font-size: 20px; position: relative;">
          <p class="text-muted" style="font-size: 14px; max-width: 600px;"><strong>Árvore:</strong> ${positiveOrNegative}</p>
          <p class="text-muted" style="font-size: 14px; max-width: 500px;"><strong>Descrição da Pergunta:</strong> ${question.question_description}</p>
          <p class="text-muted" style="font-size: 14px; max-width: 600px;"><strong>Tipo da Pergunta:</strong> ${await labelChangeTypeQuestion(question.type_question)}</p>

          ${question.type_question === 'import' && (await getParamQuestion(question.id)).import_type === 'department'
      ? `<label class="form-check form-switch form-check-custom activeReg form-check-solid mb-5"; font-size: 8px; display: flex; flex-direction: column; align-items: flex-end;">
            <input class="form-check-input" data-active-multiply="${question.id}" data-id="${question.id}" type="checkbox" ${multipleQuestionsFieldCheckedOrEmpty ? 'checked' : ''}/>
              <span class="text-muted m-2" style="font-size: 14px;"> Habilitar perguntas Múltiplas </span>
              <span class="info-icon d-flex align-items-center justify-content-center"
								data-toggle="tooltip" data-placement="top"
								title="Se habilitado, para cada departamento escolhido na resposta o sistema criará uma nova pergunta importando os Tópicos cadastrados para
                coletar avaliação específica para cada um dos departamentos.">
								<i class="bi bi-info-circle"></i>
					    </span>
            </label>` : ``

    }
        </div>
       
      </div>
    </div>
  `;
}



function handleCheckboxClick(event) {
  event.stopPropagation();
}

async function createRows(dataArray) {

  console.log(dataArray)
  const accordionContainer = document.getElementById('accordionContainer');

  accordionContainer.innerHTML = '';

  if (dataArray.length === 0) {
    const noQuestionsMessage = document.createElement('div');
    noQuestionsMessage.textContent = 'Não há perguntas disponíveis.';
    accordionContainer.appendChild(noQuestionsMessage);
  } else {
    for (const data of dataArray) {
      const cardHTML = await makeRowQuestion(data);
      accordionContainer.innerHTML += cardHTML;
    }
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
      })
    })
  }
}


async function handleDeleteClick(event, questionID) {
  event.stopPropagation();
  console.log('Question excluir:', questionID);

  deleteConfirm(questionID)

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

async function listenClickEnableMultiply() {

  const inputs = document.querySelectorAll('[data-active-multiply]')

  inputs.forEach(async input => {

    input.addEventListener('click', async (event) => {

      if (event.target.checked) {

        notifyActiveMultiplyQuestions()

      }

      const idInputClicked = event.target.dataset.id
      const newStatus = input.checked ? '1' : '0'

      const ableAndDisableMultiplyQuestions = { 'id_question': idInputClicked, 'multiply_questions': newStatus }

      try {
        const response = await fetch(
          configEnv.app_mode === 'production'
            ? configEnv.web_address + '/update/multiply/questions'
            : configEnv.local_address + '/update/multiply/questions',
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${tokenCustomer}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ableAndDisableMultiplyQuestions)
          }
        )

        const data = await response.json()

        console.log(data)

      } catch (error) {
        console.error(error)
      }


    })
  })

}


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
    case 'flex':
      return 'FLEX'
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


  } else if (typeInput.dataset.radio === 'flex') {

    // COMPONENTE DE TYPE QUESTION PARA FLEX QUESTION
    componentTypeQuestion.fadeOut(600, function () {
      componentTypeQuestion.addClass('d-none')
      componentFlexQuestion.removeClass('d-none')
      componentFlexQuestion.fadeIn(600)
    })

    // VOLTAR DO FLEX QUESTION PARA O TYPE QUESTION
    buttonBackFlexQuestion.click(function () {
      componentFlexQuestion.fadeOut(600, async function () {
        componentFlexQuestion.addClass('d-none')
        componentTypeQuestion.removeClass('d-none')
        componentTypeQuestion.fadeIn(600)
        await turnOnButtonTypes()
      })
    })

    buttonAdvanceFlexQuestion.click(async function () {
      componentFlexQuestion.fadeOut(600, async function () {
        componentFlexQuestion.addClass('d-none')
        componentReviewQuestion.removeClass('d-none')
        componentReviewQuestion.fadeIn(600)


        const dataQuestion = await getDataQuestion()
        console.log(dataQuestion)

        const answersFlexQuestion = await getPossibleAnswerFlexQuestion()
        console.log(answersFlexQuestion)

        const dataFlexAnswers = await transformPossibleAnswersInComponent(answersFlexQuestion)

        contentAreaReviewQuestion.empty()
        contentAreaReviewQuestion.append(`<span class="fw-bolder">Nome da Pergunta: </span> ${dataQuestion.title_question}<br>`)
        contentAreaReviewQuestion.append(`<strong>Pergunta:</strong> ${dataQuestion.question_description}<br>`)
        contentAreaReviewQuestion.append(`<strong>Tipo da Pergunta:</strong> ${await labelChangeTypeQuestion(dataQuestion.type_question)}<br>`)
        contentAreaReviewQuestion.append(`<strong>Possíveis Respostas:</strong> ${dataFlexAnswers}`)

      })

    })

    buttonAdvanceReviewQuestion.off('click')
    buttonAdvanceReviewQuestion.click(async function () {
      componentReviewQuestion.addClass('d-none')
      componentReviewQuestion.fadeOut(500)
      await registerQuestion(JSON.stringify(await getDataQuestion()), await getPossibleAnswerFlexQuestion())

    })

    console.log(typeInput)
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

  } else if (typeInput.dataset.radio === 'flex') {

    componentReviewQuestion.fadeOut(600, function () {
      componentReviewQuestion.addClass('d-none')
      componentFlexQuestion.removeClass('d-none')
      componentFlexQuestion.fadeIn(600)
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

async function registerQuestion(dataForm, arrayAnswersFlexQuestion) {

  console.log(dataForm)

  const paramsQuestion = await getDataParamsQuestion()

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/question' : configEnv.local_address + '/question', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: dataForm
  }).then(response => response.json()).then(async data => {

    console.log(data)


    if (data.status === 'success') {

      const registerParmsQuestionsIsOk = await registerParamsQuestion(paramsQuestion, data.questionCreated.questionId)

      if (registerParmsQuestionsIsOk) {

        if (typeof arrayAnswersFlexQuestion != 'undefined') {

          console.log('chegou dentro do if de undefined')

          const dataRegisterAnswersFlexQuestion = { question_id: data.questionCreated.questionId, answers: arrayAnswersFlexQuestion }
          console.log(JSON.stringify(dataRegisterAnswersFlexQuestion))
          await registerAnswersFlexQuestion(dataRegisterAnswersFlexQuestion)

          await notifyRegisterQuestion(data)


        } else {

          await notifyRegisterQuestion(data)

        }

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


async function registerAnswersFlexQuestion(arrayAnswersFlexQuestion) {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/add/possible/answers`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(arrayAnswersFlexQuestion)
  });

  const data = await response.json()

  console.log('resposta do register answer', data)

  return data

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
  })

  const data = await response.json()

  return data.listParams[0]

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


async function getRateTextAndIcon(label) {

  if (label === 1) {
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

    console.log(data)

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

function obterInformacoes() {
  // Obtém o formulário pelo ID
  var formulario = document.getElementById("form-flex-question-componente");
  
  // Obtém todos os elementos de input dentro do formulário
  var inputs = formulario.getElementsByTagName("input");
  
  // Array para armazenar as informações
  var informacoes = [];
  
  // Itera sobre os inputs e armazena as informações no array
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var info = {
      nome: input.name,
      valor: input.value
    };
    informacoes.push(info);
  }
  
  // Exibe o array no console (você pode fazer o que quiser com ele)
  console.log(informacoes);
  
  // Retorna o array se necessário
  return informacoes;
}

async function getPossibleAnswerFlexQuestion() {
  
  const formFlexQuestion = document.getElementById('form-flex-question-componente')
  const inputs = formFlexQuestion.getElementsByTagName("input")
  const flexAnswers = []
  
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i]
    flexAnswers.push(input.value)
  }
  
  return flexAnswers
}

//////////////////////////////////// GERENCIANDO INPUTS DINAMICOS, BOTÕES E VALIDAÇÕES /////////////////////////////////////////////////////////

const buttonAdvance = document.getElementById('button-advance-flex-question');
let inputsFlex = document.querySelectorAll('input[name="inputFlex"]');
let buttonAddInput = document.getElementById('buttonAddInput');
let buttonAddAnswer = document.getElementById('button-add-answer');
let inputContainer = document.getElementById('input-container'); 

buttonAddInput.addEventListener('click', () => {

  addInputField()
  buttonAddInput.style.display = 'none'

})


function checkInputs() {

  const isEmpty = Array.from(inputsFlex).some(input => input.value.trim() === '');

  if (isEmpty) {
    buttonAdvance.classList.add('disabled');
  } else {
    buttonAdvance.classList.remove('disabled');
  }
}

inputsFlex.forEach(input => {
  input.addEventListener('input', checkInputs);
});

function addInputField() {

  let inputModel = `
      <div class="input-group mb-2">
          <div class="d-flex flex-fill">
              <input type="text" class="form-control w-100" name="inputFlex" aria-describedby="basic-addon3" />
              <div class="input-group-append">
                  <button type="button" onclick="addInputField()" style="color: #F05742; border: none; background: none; font-weight: bold; font-size: 1.2em;">+</button>
                  <button type="button" onclick="removeInputField(this)" style="color: black; border: none; background: none; font-weight: bold; font-size: 1.2em;">-</button>
              </div>
          </div>
      </div>
  `;

  inputContainer.insertAdjacentHTML('beforeend', inputModel);

  inputsFlex = document.querySelectorAll('input[name="inputFlex"]');
  inputsFlex.forEach(input => {
    input.addEventListener('input', checkInputs);
  });

  checkInputs();

  updateAddRemoveButtons();
}

function removeInputField(button) {

  let inputGroup = button.parentNode.parentNode.parentNode;
  inputContainer.removeChild(inputGroup);

  inputsFlex = document.querySelectorAll('input[name="inputFlex"]');

  checkInputs();

  updateAddRemoveButtons();

  if (inputContainer.children.length === 0) {
    buttonAddInput.style.display = 'inline-block';
    buttonAdvance.classList.add('disabled'); 
  }
}

function updateAddRemoveButtons() {

  var allAddButtons = document.querySelectorAll('.input-group-append button:first-child');
  allAddButtons.forEach(function (button) {
    button.style.display = 'none';
  });

  var lastInputGroup = inputContainer.lastElementChild;
  if (lastInputGroup) {
    var addButton = lastInputGroup.querySelector('.input-group-append button:first-child');
    addButton.style.display = 'inline-block';
  } else {
    buttonAddInput.style.display = 'inline-block';
  }
}

function toggleAddAnswerButton() {
  let answerInputs = inputContainer.querySelectorAll('input[name="inputAnswer"]');
  let lastAnswerInput = answerInputs[answerInputs.length - 1];

  if (lastAnswerInput.value.trim() === '') {
    buttonAddAnswer.style.display = 'none';
  } else {
    buttonAddAnswer.style.display = 'inline-block';
  }
}

function addAnswerInput() {
  let inputModel = `
      <div class="input-group mb-2">
          <span class="input-group-text" id="basic-addon3">Resposta</span>
          <div class="d-flex flex-fill">
              <input type="text" class="form-control w-100" name="inputAnswer" aria-describedby="basic-addon3" />
          </div>
      </div>
  `;

  let answerContainer = document.getElementById('answer-container');
  answerContainer.insertAdjacentHTML('beforeend', inputModel);

  buttonAddAnswer.style.display = 'none';
}

let answerInputs = document.querySelectorAll('input[name="inputAnswer"]');
answerInputs.forEach(input => {
  input.addEventListener('input', toggleAddAnswerButton);
});

////////////////////////////////////////////////////////////////////////////////////////////////////

async function transformPossibleAnswersInComponent(array) {
  
  if (!Array.isArray(array)) {
    return null;
  }
  
  const htmlString = array.map(item => `<span> ${item} </span>`).join('|');
  return `<div> ${htmlString} </div>`;
  
}


async function notifyActiveMultiplyQuestions () {

  Swal.fire({
    title: 'Tem certeza?',
    text: 'Ativar esta opção pode aumentar consideravelmente o número de perguntas feitas ao cliente na pesquisa.',
    icon: 'warning',
    confirmButtonColor: '#F05742',
    confirmButtonText: 'Ok, entendi.',
    customClass: {
      confirmButton: 'btn btn-primary-confirm',
    }
  })
  
  // .then((result) => {

  //   location.reload()

  // })


}