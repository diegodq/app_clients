const tokenCustomer = localStorage.getItem('tokenCustomer')
const perguntaListada = document.getElementById('kt_accordion_1_header_1')
const textAreaPerguntaListada = document.getElementById('kt_accordion_1_body_1')
const areaAbaixoPerguntaListada = document.getElementById('kt_accordion_1_body_2')
const negativeQuestionsList = document.getElementById('negative-questions-list')
const positiveQuestionsList = document.getElementById('positive-questions-list')
const inputBrandCompany = document.getElementById('brand')
const fieldErrorBrandSize = document.getElementById('error-brand-size')
const brandCompany = document.getElementById('brand-company')
const buttonSendBrandCompany = document.getElementById('button-send-logo-brand')
const buttonEditLogoBrand = document.getElementById('edit-logo-brand')
const textAreaUploadBrand = document.getElementById('text-message-upload-brand')
const divInputBrandFile = document.getElementById('div-input-brand-file')
const textAreaColorPreview = document.getElementById('text-area-colorPreview')
const textAreaColorPreview2 = document.getElementById('text-area-colorPreview2')
const positivelabelQuestionList = document.getElementById('positive-questions-list-label')
const negativelabelQuestionList = document.getElementById('negative-questions-list-label')

// VALIDAÇÕES DE EMPRESA, TOKEN VÁLIDO E SE EXISTE TOKEN NO STORAGE
window.addEventListener('load', (event) => {
  function dropCostumer() {
    spinner.classList.add('d-flex')

    setTimeout(() => {
      spinner.classList.remove('d-flex')
      localStorage.clear()
      window.location.href = '/'
    }, 800)

    return dropCostumer()
  }

  if (!tokenCustomer) {
    dropCostumer()
  }

  try {
    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/has-company' : configEnv.local_address + '/has-company', {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
        Swal.fire({
          title: 'Oopss...',
          text: 'Sua conexão excedeu o tempo limite e irá precisar fazer login novamente, ok? #voltaLogo',
          icon: 'warning',
          confirmButtonColor: '#F05742',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary-confirm',
          }
        }).then((result) => {

          spinner.classList.add('d-flex')
          setTimeout(() => {

            spinner.classList.remove('d-flex')
            dropCostumer()

          }, 500)

        })
        dropCostumer()
        localStorage.clear()
      })
  } catch (error) {
    Swal.fire({
      title: 'Oopss...',
      text: 'Sua conexão excedeu o tempo limite e irá precisar fazer login novamente, ok? #voltaLogo',
      icon: 'warning',
      confirmButtonColor: '#F05742',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary-confirm',
      }
    }).then((result) => {

      spinner.classList.add('d-flex')
      setTimeout(() => {

        spinner.classList.remove('d-flex')
        dropCostumer()

      }, 500)

    })
    dropCostumer()
    localStorage.clear()
  }

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/has-company' : configEnv.local_address + '/has-company', {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  }).then(response => response.json()).then(data => {

    if (data.message === 'Acesso não autorizado.') {

      Swal.fire({
        title: 'Oopss...',
        text: 'Sua conexão excedeu o tempo limite e irá precisar fazer login novamente, ok? #voltaLogo',
        icon: 'warning',
        confirmButtonColor: '#F05742',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary-confirm',
        }
      }).then((result) => {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          dropCostumer()

        }, 500)

      })

    }

    if (data.message === 'no-company') {

      Swal.fire({
        title: 'Espera um minuto...',
        text: 'Identificamos que você ainda não concluiu seu cadastro e isso é necessário para prosseguirmos. Iremos te encaminhar para que insira os dados que ainda estão pendentes.',
        icon: 'warning',
        confirmButtonColor: '#F05742',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary-confirm',
        }
      }).then((result) => {

        spinner.classList.add('d-flex')
        setTimeout(() => {

          spinner.classList.remove('d-flex')
          window.location.href = '/sign-up-company'

        }, 500)

      })

    }

  }).catch(error => {
    dropCostumer()
    localStorage.clear()
  })

})

// BUSCAR INFORMAÇÕES DO USUÁRIO NA API
window.addEventListener('load', async (event) => {

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })
    .then((response) => response.json())
    .then((data) => {
      // ATUALIZA OS DADOS DO HEADER MENU

      nameCustomerHeader.innerText = data.first_name;
      positionCustomerHeader.innerText = data.position;

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

    }).catch(error => console.log(error))

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/logo-company' : configEnv.local_address + '/logo-company', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })
    .then((response) => response.json())
    .then((data) => {

      if (data.logo) {

        brandCompany.setAttribute('src', data.logo)
        const hasOrNotLogo = data.logo ? 'has' : 'no-has'
        managerInputFileBrand('has')

      } else {

        managerInputFileBrand()
        brandCompany.setAttribute('src', '/assets/media/avatars/blank.png')

      }

    }).catch(error => console.log(error))

  fillFieldsPage()

  const initialPassingTree = await getInitialPassingTree()
  if (initialPassingTree === null) {
    updateSelection(4)
  } else {
    updateSelection(initialPassingTree)
  }

})

async function fillFieldsPage() {
  const responsedataParams = await fetch( `${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/questions`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })
  const dataParams = await responsedataParams.json()
  
  if (dataParams.message === 'no-data') {

    positiveQuestionsList.classList.add("text-muted", "fs-6", "text-center")
    positivelabelQuestionList.innerText = 'Ainda não há perguntas cadastradas.'
    negativeQuestionsList.classList.add("text-muted", "fs-6", "text-center")
    negativelabelQuestionList.innerText = 'Ainda não há perguntas cadastradas.'
    
  } else {

  const dataOrderByPosition = orderByPositionAcorddionList(dataParams.list)
  createRows(dataOrderByPosition)

  }
}

function orderByPositionAcorddionList(arr) {
  const sortedArray = arr.map(obj => {
    const { params_questions, company, ...rest } = obj;
    const position = params_questions ? params_questions.position : null;
    return {
      position,
      ...rest
    };
  });

  sortedArray.sort((a, b) => a.position - b.position);

  return sortedArray;
}

async function createRows(data) {

  positiveQuestionsList.innerHTML = ""
  negativeQuestionsList.innerHTML = ""

  const inputNames = ["PERGUNTA OBRIGATÓRIA", "ENCERRAR PESQUISA"];
  const inputLabels = {
    "PERGUNTA OBRIGATÓRIA": "O cliente terá obrigação de responder para prosseguir ou enviar a pesquisa.",
    "ENCERRAR PESQUISA": "A depender da resposta que esta pergunta receberá, a pesquisa será encerrada."
  };
  const checkboxNames = ["mandatory_question", "finish_research"];

  data.forEach(async (item, index) => {
  
    const accordionItem = createAccordionItem(index + 1, item.title_question);
    const accordionCollapse = createAccordionCollapse(index);
    accordionItem.id = item.id
    const accordionBody = await createAccordionBody(inputNames, inputLabels, checkboxNames, index, item);

    accordionCollapse.appendChild(accordionBody);
    accordionItem.append(accordionCollapse);

    if (item.status === 1) {

      if (item.tree_question === 1) {
        positiveQuestionsList.appendChild(accordionItem);
      } else {
        negativeQuestionsList.appendChild(accordionItem);
      }

    }

    const buttonElement = accordionItem.querySelector("button");
    buttonElement.addEventListener("click", () => {
      accordionCollapse.classList.toggle("show");
      buttonElement.classList.toggle("collapsed");
      //console.log("Clicou no acordeão com ID:", accordionItem.id);
    });
    updateButtonNumbers(negativeQuestionsList)
    updateButtonNumbers(positiveQuestionsList)
  });

  initializeSortable(positiveQuestionsList);
  initializeSortable(negativeQuestionsList);
  updateButtonNumbers(positiveQuestionsList);
  updateButtonNumbers(negativeQuestionsList);
}

function createAccordionItem(id, title) {
  const accordionItem = document.createElement("div")
  accordionItem.className = "accordion-item"

  const accordionHeader = document.createElement("h2")
  accordionHeader.className = "accordion-header"
  accordionHeader.id = id

  const button = document.createElement("button")
  button.className = "rounded border accordion-button fs-4 fw-bold collapsed my-button"
  button.type = "button"
  button.textContent = `# ${id} - ${title}`

  accordionHeader.appendChild(button)
  accordionItem.appendChild(accordionHeader)

  return accordionItem
}

function createAccordionCollapse(index) {
  const accordionCollapse = document.createElement("div");
  accordionCollapse.className = "accordion-collapse collapse";
  accordionCollapse.id = `accordion-collapse-${index}`;

  return accordionCollapse;
}

async function getDataParams(questionID) {
  
  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/question/${questionID}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
    },
  })
  const data = await response.json()
  return data
}

async function createAccordionBody(inputNames, inputLabels, checkboxNames, index, allDataQuestion) {

  const accordionBody = document.createElement("div")
  accordionBody.classList.add("accordion-body")

  const questionDescriptionSpan = document.createElement("span")
  questionDescriptionSpan.classList.add('fw-bolder', 'fs-5', 'align-items-start')
  questionDescriptionSpan.innerText = `Pergunta: ${allDataQuestion.question_description}`
  accordionBody.appendChild(questionDescriptionSpan)

  const numOptions = Math.min(inputNames.length, 5)

  for (let i = 1; i <= numOptions; i++) {
    const label = await createLabel(inputNames[i - 1], inputLabels[inputNames[i - 1]], checkboxNames[i - 1], index, i, allDataQuestion)
    accordionBody.appendChild(label)
  }

  accordionBody.addEventListener("change", () => {
    printQuestionList()
  })

  return accordionBody
}

async function createLabel(inputName, inputLabel, checkboxName, index, optionIndex, allDataQuestion) {

  const label = document.createElement("label")
  label.classList.add("form-check", "form-check-custom", "form-check-solid", "align-items-start", "mt-8")
  label.htmlFor = `input_${index}_${optionIndex}`

  const input = document.createElement("input")
  const questionParams = await getDataParams(allDataQuestion.id) 
  const valueParam = Number(questionParams.listParams[0] == undefined ? '' : questionParams.listParams[0][checkboxName])

  input.classList.add("form-check-input", "me-3")
  input.type = "checkbox"
  input.id = `input_${index}_${optionIndex}`
  input.name = checkboxName
  input.dataset.chave = checkboxName
  input.value = "0"
  input.checked = valueParam === 0 ? false : true


  const inputLabelContainer = document.createElement("span")
  inputLabelContainer.classList.add("form-check-label", "d-flex", "flex-column", "align-items-start")

  const inputLabelTitle = document.createElement("span")
  inputLabelTitle.classList.add("fw-bolder", "fs-5", "mb-0")
  inputLabelTitle.textContent = inputName

  const inputLabelText = document.createElement("span")
  inputLabelText.classList.add("text-muted", "fs-6")
  inputLabelText.textContent = inputLabel

  inputLabelContainer.appendChild(inputLabelTitle)
  inputLabelContainer.appendChild(inputLabelText)

  label.appendChild(input)
  label.appendChild(inputLabelContainer)

  return label
}

function initializeSortable(container) {
  Sortable.create(container, {
    handle: ".accordion-header",
    animation: 600,
    onEnd: (evt) => {
      updateButtonNumbers(container);
      //console.log("Acordeão movido para a posição:", evt.newIndex);
      printQuestionList();
    },
  });
}

function updateButtonNumbers(container) {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button, index) => {
    const [, title] = button.textContent.split(" - ");
    button.textContent = `# ${index + 1} - ${title}`;
  });
}

function printQuestionList() {

  const questions = []

  const processAccordionList = (accordionList) => {
    accordionList.forEach((accordion, index) => {
      const question = {
        question: accordion.id,
        position: index + 1,
      }

      const checkboxes = accordion.querySelectorAll("input[type='checkbox']")
      checkboxes.forEach((checkbox) => {
        question[checkbox.name] = checkbox.checked === true ? 1 : 0
      })

      questions.push(question)
    })
  }

  const positiveAccordions = positiveQuestionsList.querySelectorAll(".accordion-item");
  processAccordionList(Array.from(positiveAccordions));

  const negativeAccordions = negativeQuestionsList.querySelectorAll(".accordion-item");
  processAccordionList(Array.from(negativeAccordions));

  registerParamsQuestion(questions)
}

async function registerParamsQuestion(data) {

  fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/boolean/question`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json()).then(data => console.log(data))
}

function requestColorPicker(route, data, prop) {

  const dataRequest = { [prop]: data, id_params: 4 }
  console.log(dataRequest)
  fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/${route}`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataRequest)
  })
    .then(response => response.json())
}

async function createColorPicker(selector, previewId, initialColor, textArea) {
  let colorPicker = new iro.ColorPicker(selector, {
    width: 140,
    color: initialColor,
  });

  let colorPreview = document.getElementById(previewId)
  colorPreview.style.backgroundColor = initialColor
  textArea.innerHTML = initialColor

  colorPicker.on("color:change", function (color) {
    colorPreview.style.backgroundColor = color.hexString
    let selectedColor = color.hexString
    textArea.innerHTML = selectedColor

    if (selector === "#picker") {
      requestColorPicker('background-color', selectedColor, 'background_color')
    } else if (selector === "#picker2") {
      requestColorPicker('font-color', selectedColor, 'font_color')
    }
  });
}

async function getInitialBackgroundColor() {
  const response = await fetch(`http://localhost:3007/params/product/5`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json()
  return data.listParams[0].background_color
}

async function getInitialFontColor() {
  const response = await fetch(`http://localhost:3007/params/product/5`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json()
  return data.listParams[0].font_color
}

async function getInitialPassingTree() {
  
  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/product/5`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json()
  return data.listParams[0].passing_tree

}

async function initializeColorPicker() {
  try {
    const bgColor = await getInitialBackgroundColor()
    const fontColor = await getInitialFontColor()

    createColorPicker("#picker", "colorPreview", bgColor === null ? '#fff' : bgColor, textAreaColorPreview)
    createColorPicker("#picker2", "colorPreview2", fontColor === null ? '#fff' : fontColor, textAreaColorPreview2)
  } catch (error) {
    console.error(error)
  }
}

initializeColorPicker()

function updateBrandCustomer() {

  const file = inputBrandCompany.files[0]

  if (file.size > 1000000) {

    fieldErrorBrandSize.innerText = 'A imagem inserida excede o tamanho permitido de 1mb.'

  } else {

    const fileExtension = file.name.split('.').pop()
    const hash = CryptoJS.lib.WordArray.random(10).toString(CryptoJS.enc.Hex)
    const fileName = `${hash}.${fileExtension}`

    const formData = new FormData();
    formData.append('file', file, fileName)

    fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/logo-company' : configEnv.local_address + '/logo-company', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${tokenCustomer}`
      },
      body: formData
    })
      .then(response => response.json()
        .then(data => {

          if (data.status === 'success') {

            spinner.classList.add('d-flex')

            setTimeout(() => {

              spinner.classList.remove('d-flex')
              modalConfirm.show()

              titleModalConfirm.innerText = `SUCESSO!`
              textModalConfirm.innerText = `Sua marca foi recebida com sucesso!`
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
              textModalConfirm.innerText = `A sua Marca não foi salva. Verifique o arquivo e tente novamente.`
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


            }, 1000);

            setTimeout(() => {

              modalConfirm.hide()
              location.reload()

            }, 3000)


          }

        }))

  }

}

function managerInputFileBrand(hasOrNotHas) {

  if (hasOrNotHas === 'has') {
    buttonSendBrandCompany.style.display = 'none';
    buttonEditLogoBrand.style.display = 'block';

  } else {

    buttonSendBrandCompany.style.display = 'block';
    buttonEditLogoBrand.style.display = 'none';
  }
}

buttonEditLogoBrand.addEventListener('click', event => {
  event.preventDefault()
  managerInputFileBrand('no-has')
})

inputBrandCompany.addEventListener('change', event => {
  updateBrandCustomer()
})

const svgElements = document.querySelectorAll('.svg-nps')
let selectedIndex = -1

svgElements.forEach((svg, index) => {

  svg.addEventListener('click', () => {
    
    updateSelection(index)
    updatePassingTree(selectedIndex)

  })

})

function updatePassingTree(targetClick) {

  const dataPassingTree = { id_params: 4, passing_tree: targetClick }

  fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/passing/tree`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataPassingTree)
  })
    .then(response => response.json())
}

function updateSelection(selectedIndexParam) {
  if (selectedIndexParam !== undefined) {
    selectedIndex = selectedIndexParam
  }

  svgElements.forEach((svg, index) => {
    if (index < selectedIndex) {
      const labels = svg.parentElement.querySelectorAll('label')
      labels.forEach(label => {
        if (label.textContent == 'NEGATIVA') {
          label.classList.remove('d-none')
        } else {
          label.classList.add('d-none')
        }
      })
      svg.classList.remove('selected-group')
      svg.classList.add('unselected-group')
    } else {
      const labels = svg.parentElement.querySelectorAll('label')
      labels.forEach(label => {
        if (label.textContent == 'POSITIVA') {
          label.classList.remove('d-none')
        } else {
          label.classList.add('d-none')
        }
      })
      svg.classList.add('selected-group')
      svg.classList.remove('unselected-group')
    }
  })
}
