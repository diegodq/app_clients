const modalRegisterTools = $('#modal-register-tools')
const modalViewTools = $('#modal-view-tools')
const toolsTypeComponent = $('#tools-type-component')
const toolsTreeComponent = $('#tree-tools-component')
const toolsAlertComponent = $('#alert-tools-component')
const toolsFinishComponent = $('#finish-survey-component')
const fieldNoQuestion = document.getElementById('field-no-questions')
const questionsTable = document.getElementById('questions_table')
const typesTools = ['alert', 'contact', 'finish']
const searchInput = document.getElementById('search-input')


window.addEventListener('load', async (event) => {

    await fillFieldsPage()

})

async function getDataQuestions() {

    const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/company-questions' : configEnv.local_address + '/company-questions', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tokenCustomer,
            'Content-Type': 'application/json'
        },
    })

    const dataQuestions = response.json()

    return dataQuestions
}

async function fillFieldsPage() {

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/company-questions' : configEnv.local_address + '/company-questions', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + tokenCustomer,
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(async (data) => {

            if (data.message === 'no-questions') {

                fieldNoQuestion.innerText = 'Não há ferramentas cadastradas.'

            } else {

                fieldNoQuestion.innerText = ''
                const dataTools = data.filter(element => typesTools.includes(element.type_question))

                if (dataTools == '') {

                    fieldNoQuestion.innerText = 'Não há ferramentas cadastradas.'

                }

                await createRows(dataTools)
                await listenClickViewTools()
                await listenClickDeleteIcon()

            }

        })

}

function managerClickInputType(event) {

    const target = event.target
    const elementId = target.id
    //console.log(`Houve clique no elemento com id "${elementId}"`)

    if (target.checked) {
        const radioInputsTypeTools = document.querySelectorAll('input[type="radio"][name="type-tools"]')
        radioInputsTypeTools.forEach((input) => {

            if (input !== target) {

                input.checked = false
                input.disabled = true

            }

        })
    }

    return elementId

}

function resetWhenBackType() {

    const radioInputsTypeTools = document.querySelectorAll('input[type="radio"][name="type-tools"]')
    radioInputsTypeTools.forEach((input) => {
        input.disabled = false
    })
    $('#input-finish-text').val(''),
        $('input[name="inputButton1"]').val(''),
        $('input[name="inputButton2"]').val(''),
        $('#input-alert-text').val('')

}

const radioInputsTypeTools = document.querySelectorAll('input[type="radio"][name="type-tools"]')
radioInputsTypeTools.forEach((input) => {
    input.addEventListener('change', (event) => {

        const idTypeTools = managerClickInputType(event)

        choiceWayTools(idTypeTools)

    })
})

const buttonBackTypeTools = document.getElementById('button-back-tree')
buttonBackTypeTools.addEventListener('click', (event) => {
    fadeComponents(toolsTypeComponent, toolsTreeComponent)
})

function fadeComponents(componentOut, componentIn) {

    if (componentIn == undefined) {

        componentOut.fadeOut(600, function () { componentOut.addClass('d-none') })

    } else {

        componentOut.fadeOut(600, function () {
            componentOut.addClass('d-none')
            componentIn.removeClass('d-none')
            componentIn.fadeIn(600)
        })

    }

}

async function choiceWayTools(IdTools) {

    if (IdTools === 'radio_contact_survey') {

        fadeComponents(toolsTypeComponent)

        const dataQuestion = getDataTools(IdTools, 'SOLIC. CONTATO')

        registerQuestion(dataQuestion)

    }

    if (IdTools === 'radio_finish_survey') {

        fadeComponents(toolsTypeComponent, toolsFinishComponent)

        const buttonBackFinish = document.getElementById('button-back-finish')
        buttonBackFinish.addEventListener('click', (event) => {
            event.preventDefault()
            resetWhenBackType()
            fadeComponents(toolsFinishComponent, toolsTypeComponent)
        })
    }

    if (IdTools === 'radio_alert_survey') {

        fadeComponents(toolsTypeComponent, toolsAlertComponent)

        const buttonBackAlert = document.getElementById('button-back-save-alert')
        buttonBackAlert.addEventListener('click', (event) => {
            event.preventDefault()
            resetWhenBackType()
            fadeComponents(toolsAlertComponent, toolsTypeComponent)
        })

    }

}

function getDataTools(type, title) {
    return {
        title_question: title,
        tree_question: Array.from(radioTree).filter(radio => radio.checked === true).map(radio => radio.dataset.tree)[0],
        question_description: '',
        type_question: labelChangeType(type),
        status: 1,
        text_end_research: $('#input-finish-text').val(),
        text_label_one: $('input[name="inputButton1"]').val(),
        text_label_two: $('input[name="inputButton2"]').val(),
        research_title: '',
        alert_label: $('#input-alert-text').val(),
    }
}

function labelChangeType(type) {
    switch (type) {
        case 'radio_alert_survey':
            return 'alert'
        case 'radio_finish_survey':
            return 'finish'
        case 'radio_contact_survey':
            return 'contact'
        default:
            return 'Opção inválida'
    }
}

const radioTree = document.querySelectorAll('[data-tree]')

radioTree.forEach(async (input) => {
    input.addEventListener('click', async () => {

        fadeComponents(toolsTreeComponent, toolsTypeComponent)

        const allQuestions = await getDataQuestions()

        if (allQuestions.message != 'no-questions') {

            const treeChoiced = Number(input.dataset.tree) 
            const existThisTreeForQuestion = allQuestions.filter(item => item.type_question === "contact").some(item => item.tree_question === treeChoiced)
    
            if (existThisTreeForQuestion) {
    
                const radioInputsTypeTools = document.querySelectorAll('input[type="radio"][name="type-tools"]')
                radioInputsTypeTools.forEach((input) => {
    
                    if (input.id === 'radio_contact_survey') {
    
                        input.disabled = true
            
                    }
    
                })
    
            }

        }
       

    })

    const buttonCancelTree = document.getElementById('button-cancel-tree')
    buttonCancelTree.addEventListener('click', (event) => {
        modalRegisterTools.hide()
        location.reload()
    })

})

async function registerQuestion(dataForm) {

    const paramsQuestion = await getDataParamsQuestion(dataForm.type_question)

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/question' : configEnv.local_address + '/question', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + tokenCustomer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
    }).then(response => response.json()).then(data => {

        modalRegisterTools.hide()

        if (data.status === 'success') {

            if (registerParamsQuestion(paramsQuestion, data.questionCreated.questionId)) {

                notifyRegisterQuestion(data)

            } else {

                notifyRegisterQuestion({ status: 'warn' })

            }

        }

    })

}

async function createRows(data) {

    const createLinesTable = await data.map(async (item, index) => {
        const row = questionsTable.insertRow()
        const cells = []

        //const idQuestion = document.createElement('td')
        //const nameQuestion = document.createElement('td')
        const typeQuestion = document.createElement('td')
        const treeQuestion = document.createElement('td')
        const statusQuestion = document.createElement('td')
        const optionsRow = document.createElement('td')
        cells.push(typeQuestion, treeQuestion, statusQuestion, optionsRow)

        //idQuestion.innerHTML = item.id
        //nameQuestion.innerHTML = item.title_question
        treeQuestion.innerHTML = item.tree_question === 1 ? await getRateTextAndIcon('POSITIVA') : await getRateTextAndIcon('NEGATIVA')
        typeQuestion.innerHTML = labelChangeForList(item.type_question)
        const checkedOrEmpty = item.status === 0 ? '' : 'checked'
        statusQuestion.innerHTML = `<label class="form-check form-switch form-check-custom activeReg form-check-solid">
        <input class="form-check-input" data-active=${item.status} data-id=${item.id} type="checkbox" ${checkedOrEmpty ? 'checked' : ''} />
        </label>`
        optionsRow.innerHTML = `<div class="d-flex justify-content-center">
        <span class="btn btn-sm btn-outline-light rounded-pill update" data-id="${item.id}">
          <a>
            <i class="bi bi-card-text bi-lg cursor-pointer" data-id="${item.id}" data-name="${item.name}" data-status="${item.status}"></i>
          </a>
        </span>
        <span class="btn btn-sm btn-outline-light rounded-pill delete" data-id="${item.id}">
          <a>
            <i class="bi bi-trash bi-lg cursor-pointer" data-id="${item.id}"></i>
          </a>
        </span>
      </div>`

        row.classList.add('text-gray-800', 'text-center')


        cells.forEach((cell) => {
            cell.style.display = 'none'
        })
        Array.from(questionsTable.querySelectorAll('th')).forEach((titleCell) => {
            titleCell.style.display = 'none'
        });


        cells.forEach((cell) => {
            cell.style.display = 'table-cell'
            row.appendChild(cell)
        });
        Array.from(questionsTable.querySelectorAll('th')).forEach((titleCell) => {
            titleCell.style.display = 'table-cell'
        })


        return row
    })

    await listenClickActive()
    
}

async function listenClickActive() {

    const input = document.querySelectorAll('[data-active]')

    input.forEach(input => {
        input.addEventListener('click', (event) => {
            let idInputClicked = event.target.dataset.id

            if (input.checked === true) {

                const activeOrInative = { 'id': idInputClicked, 'new_status': '1' }

                fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/question' : configEnv.local_address + '/question', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${tokenCustomer}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(activeOrInative)

                })

            } else {

                const activeOrInative = { 'id': idInputClicked, 'new_status': '0' }

                fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/question' : configEnv.local_address + '/question', {
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

function labelChangeForList(type) {
    switch (type) {
        case 'alert':
            return 'ALERTA'
        case 'finish':
            return 'ENCERRAR PESQUISA'
        case 'contact':
            return 'CONTATO'
        default:
            return 'Opção inválida'
    }
}

async function notifyRegisterQuestion(data) {

    if (data.status === 'success') {

        spinner.classList.add('d-flex')
        setTimeout(() => {

            spinner.classList.remove('d-flex')
            modalConfirm.show()

            titleModalConfirm.innerText = `SUCESSO!`
            textModalConfirm.innerText = `Sua ferramenta foi cadastrado com sucesso!`
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

async function getDataParamsQuestion(type) {
    return [{
        'option_one': '',
        'option_two': '',
        'import_type': type
    }]

}

async function registerParamsQuestion(dataForm, idQuestion) {


    dataForm[0].question = idQuestion;


    const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/params/question' : configEnv.local_address + '/params/question', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + tokenCustomer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
    })

    const data = await response.json()

    const trueOrFalse = data.status === 'success' ? true : false
    return trueOrFalse
}

async function listenClickViewTools() {

    const spans = document.querySelectorAll('.btn-outline-light.rounded-pill.update')

    spans.forEach((span) => {
        span.addEventListener('click', async (event) => {

            const allQuestions = await getDataQuestions()
            const questionChoiced = allQuestions.find(question => question.id == event.target.dataset.id)
            showDynamicModal(questionChoiced)
        })
    })
}

async function showDynamicModal(question) {

    const titleElement = document.querySelector('.modal-title')
    const textElement = document.querySelector('.modal-text')

    if (question.type_question === 'alert') {
        titleElement.textContent = 'ALERTA AO CLIENTE'
        textElement.innerHTML = `
            <label><strong>Texto do Alerta</strong> : ${question.alert_label} </label>
        `
    }

    if (question.type_question === 'finish') {
        titleElement.textContent = 'ENCERRAMENTO DE PESQUISA'
        textElement.innerHTML = `
            <label><strong>Texto de Encerramento</strong> : ${question.text_end_research} </label>
            <label><strong>Texto do Botão 01</strong> : ${question.text_label_one} </label>
            <label><strong>Texto do Botão 02</strong> : ${question.text_label_two} </label>
            <label style="font-size: 10px"> <span style="color: red">^</span> Este é o botão que encerrará a pesquisa. </label>
        `
    }

    if (question.type_question === 'contact') {
        titleElement.textContent = 'SOLICITAÇÂO DE CONTATO'
        textElement.innerHTML = `<label> Esta ferramenta irá solicitar no local em que inseri-la o contato (Nome e Celular) do cliente que estiver respondendo a pesquisa.</label>`
    }

    modalViewTools.find('.modal-title').html(titleElement.innerHTML);
    modalViewTools.find('.modal-text').html(textElement.innerHTML);

    modalViewTools.modal('show');
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
                textModalConfirm.innerText = `A ferramenta de pesquisa selecionada foi excluída.`
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
                textModalConfirm.innerText = `Algo deu errado e a ferramenta de pesquisa não foi excluída conforme sua solicitação. Tente novamente!`
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
        text: 'Você tem certeza que deseja excluir a ferramenta de pesquisa selecionada?',
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
