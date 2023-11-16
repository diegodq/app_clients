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
const buttonPreviewSurvey = document.getElementById('button-preview-survey')
const textAreaUploadBrand = document.getElementById('text-message-upload-brand')
const divInputBrandFile = document.getElementById('div-input-brand-file')
const textAreaColorPreview = document.getElementById('text-area-colorPreview')
const textAreaColorPreview2 = document.getElementById('text-area-colorPreview2')
const positivelabelQuestionList = document.getElementById('positive-questions-list-label')
const negativelabelQuestionList = document.getElementById('negative-questions-list-label')
const areaQrCodeCustomer = document.getElementById('qr-code-field')
const buttonDownloadQrCode = document.getElementById('download-qrCode')
const paramsDownloadQrCode = document.getElementById('params-download-qrCode')

window.addEventListener('load', async (event) => {

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/logo-company' : configEnv.local_address + '/logo-company', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })
    .then((response) => response.json())
    .then(async (data) => {

      if (data.logo) {

        brandCompany.setAttribute('src', data.logo)
        const hasOrNotLogo = data.logo ? 'has' : 'no-has'
        await managerInputFileBrand('has')

      } else {

        await managerInputFileBrand()
        brandCompany.setAttribute('src', '/assets/media/avatars/no-brand.png')

      }

    }).catch(error => console.log(error))

  const paramsProductNps = await getProductNps()

  if (paramsProductNps.passing_tree === null) {
    await updatePassingTree(4)
    await updateSelectionSvgAnchorQuestion(4)
  } else {
    await updateSelectionSvgAnchorQuestion(paramsProductNps.passing_tree)
  }

  initializeColorPicker()
  fillFieldsPage()
  setAllowOrNotIpProtection()


  const selectStore = document.getElementById("storeSelect")

  const allowMultiStore = await multiStoreAvailable()

  if (allowMultiStore) {

    let selectedIndex = selectStore.selectedIndex

    changeSelectButtonState(selectedIndex)
    await fillStoresSelect()
    const allStores = await getStoreList()

    const initialQrCodeAddress = await setQrCode(allStores[0].id)

    buttonDownloadQrCode.addEventListener('click', function(event) {
      downloadQrCode(event, initialQrCodeAddress);
    })

  } else {

    selectStore.disabled = true
    changeSelectButtonState('disabled')
    const option = document.createElement("option")
    option.value = 0
    option.textContent = 'OPÇÃO MULTILOJA DESABILITADA'; 
    selectStore.appendChild(option)
    await setQrCode(0)

  }

})

async function fillFieldsPage() {

  const responsedataParams = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/questions`, {
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

    const dataQuestionOrder = await orderAccordionList(dataParams.list)
    await createRows(dataQuestionOrder)

  }
}

async function orderAccordionList(list) {

  const adjustQuestionList = list.map(obj => {
    const { params_questions, company, ...rest } = obj;
    const position = params_questions?.position ?? null;
    return {
      position,
      ...rest
    }
  })


  const noQuestionHasPosition = adjustQuestionList.every(question => question.position === null)

  if (noQuestionHasPosition) {

    return adjustQuestionList

  } else {

    const sortedArray = adjustQuestionList.sort((a, b) => {
      if (a.position === null) return 1
      if (b.position === null) return -1
      return a.position - b.position;
    })

    return sortedArray
  }

}

async function createRows(data) {

  positiveQuestionsList.innerHTML = ""
  negativeQuestionsList.innerHTML = ""

  const dataTeste = 0
  const inputNames = dataTeste === 0 ? ["RESPOSTA OBRIGATÓRIA"] : []
  const inputLabels = {
    "RESPOSTA OBRIGATÓRIA": "O cliente terá obrigação de responder para prosseguir ou enviar a pesquisa."
  };
  const checkboxNames = dataTeste === 0 ? ["mandatory_question"] : []

  for (const [index, item] of data.entries()) {

    const accordionItem = await createAccordionItem(index + 1, item.title_question)
    const accordionCollapse = await createAccordionCollapse(index)
    accordionItem.id = item.id

    const accordionBody = await createAccordionBody(inputNames, inputLabels, checkboxNames, index, item)

    accordionCollapse.appendChild(accordionBody)
    accordionItem.append(accordionCollapse)

    if (item.status === 1) {
      if (item.tree_question === 1) {
        positiveQuestionsList.appendChild(accordionItem)
      } else {
        negativeQuestionsList.appendChild(accordionItem)
      }
    }

    const buttonElement = accordionItem.querySelector("button")
    buttonElement.addEventListener("click", () => {
      accordionCollapse.classList.toggle("show")
      buttonElement.classList.toggle("collapsed")
      //console.log("Clicou no acordeão com ID:", accordionItem.id);
    });
    updateButtonNumbers(negativeQuestionsList)
    updateButtonNumbers(positiveQuestionsList)
  }

  initializeSortable(positiveQuestionsList)
  initializeSortable(negativeQuestionsList)
  updateButtonNumbers(positiveQuestionsList)
  updateButtonNumbers(negativeQuestionsList)
}

async function createAccordionItem(id, title) {
  const accordionItem = document.createElement("div")
  accordionItem.className = "accordion-item"

  const accordionHeader = document.createElement("h2")
  accordionHeader.className = "accordion-header"
  accordionHeader.id = id

  const button = document.createElement("button")
  button.className = "rounded border accordion-button fs-4 fw-bold collapsed my-button"
  button.type = "button"
  button.textContent = `# ${id} - ${title}`

  if (title === 'ALERTA' || title === 'FINA. PESQUISA' || title === 'SOLIC. CONTATO') {
    button.style.backgroundColor = "#e7f2f9"
  }

  accordionHeader.appendChild(button)
  accordionItem.appendChild(accordionHeader)

  return accordionItem
}

async function createAccordionCollapse(index) {
  const accordionCollapse = document.createElement("div");
  accordionCollapse.className = "accordion-collapse collapse";
  accordionCollapse.id = `accordion-collapse-${index}`;

  return accordionCollapse;
}

async function createAccordionBody(inputNames, inputLabels, checkboxNames, index, allDataQuestion) {
  const accordionBody = document.createElement("div");
  accordionBody.classList.add("accordion-body");

  const questionDescriptionSpan = document.createElement("span");
  questionDescriptionSpan.classList.add('fw-bolder', 'fs-5', 'align-items-start');

  if (allDataQuestion.type_question === 'alert') {
    questionDescriptionSpan.innerText = `${allDataQuestion.alert_label}`;
  } else if (allDataQuestion.type_question === 'contact') {
    questionDescriptionSpan.innerText = `Ferramenta: Solicitação padrão de contato.`;
  } else if (allDataQuestion.type_question === 'finish') {
    questionDescriptionSpan.innerText = `${allDataQuestion.text_end_research}`;
  } else {
    questionDescriptionSpan.innerText = `Pergunta: ${allDataQuestion.question_description}`;
  }

  accordionBody.appendChild(questionDescriptionSpan);

  if (allDataQuestion.type_question !== 'alert' && allDataQuestion.type_question !== 'finish' && allDataQuestion.type_question !== 'binary') {
    const numOptions = Math.min(inputNames.length, 5);
    for (let i = 1; i <= numOptions; i++) {
      const label = await createLabel(inputNames[i - 1], inputLabels[inputNames[i - 1]], checkboxNames[i - 1], index, i, allDataQuestion);
      accordionBody.appendChild(label);
    }
  }

  accordionBody.addEventListener("change", () => {
    printQuestionList();
  });

  return accordionBody;
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

async function updateButtonNumbers(container) {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button, index) => {
    const [, title] = button.textContent.split(" - ");
    button.textContent = `# ${index + 1} - ${title}`;
  });
}

async function printQuestionList() {
  const questions = [];

  const processAccordionList = (accordionList) => {
    accordionList.forEach((accordion, index) => {
      const question = {
        question: accordion.id,
        position: index + 1,
      };

      const questionParamModel = {
        finish_research: 0,
        mandatory_question: 0,
        position: 0,
        question: "",
        ...question,
      };

      const checkboxes = accordion.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          questionParamModel[checkbox.name] = 1;
        }
      });

      questions.push(questionParamModel);
    });
  };

  const positiveAccordions = positiveQuestionsList.querySelectorAll(".accordion-item");
  processAccordionList(Array.from(positiveAccordions));

  const negativeAccordions = negativeQuestionsList.querySelectorAll(".accordion-item");
  processAccordionList(Array.from(negativeAccordions));

  registerParamsQuestion(questions);
}

async function initializeSortable(container) {
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

async function initializeSortable(container) {
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

async function getProductNps() {

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/product`, {
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })

  const data = await response.json()

  return data.message[0]

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

async function registerParamsQuestion(data) {

  fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/boolean/question`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())//.then(data => console.log(data))
}

async function requestColorPicker(route, data, prop) {

  const dataRequest = { [prop]: data }

  fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/params/${route}`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataRequest)
  })
    .then(response => response.json()).then(data => console.log(data))
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
  })
}

async function initializeColorPicker() {
  try {
    const paramsProductNps = await getProductNps()

    createColorPicker("#picker", "colorPreview", paramsProductNps.background_color === null ? '#fff' : paramsProductNps.background_color, textAreaColorPreview)
    createColorPicker("#picker2", "colorPreview2", paramsProductNps.font_color === null ? '#fff' : paramsProductNps.font_color, textAreaColorPreview2)

  } catch (error) {
    console.error(error)
  }
}

async function updateBrandCustomer() {

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

async function managerInputFileBrand(hasOrNotHas) {

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

function switchSvgToNumber(svg) {
  if (svg === 'svg-1') return 0
  if (svg === 'svg-2') return 1
  if (svg === 'svg-3') return 2
  if (svg === 'svg-4') return 3
  if (svg === 'svg-5') return 4
}

svgElements.forEach((svg, index) => {

  svg.addEventListener('click', (event) => {

    if (event.target.id === 'svg-1') {

      setJustOneTreeMessage()
      updateSelectionSvgAnchorQuestion(index)
      updatePassingTree(switchSvgToNumber(event.target.id))

    } else {

      updateSelectionSvgAnchorQuestion(index)
      updatePassingTree(switchSvgToNumber(event.target.id))


    }

  })

})

async function updatePassingTree(targetClick) {

  const dataPassingTree = { passing_tree: targetClick }

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

async function updateSelectionSvgAnchorQuestion(selectedIndexParam) {

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

async function setJustOneTreeMessage() {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'O princípio da pesquisa é que tenha 2 árvores de perguntas. Da forma com que selecionou haverá apenas UMA árvore.',
    icon: 'warning',
    confirmButtonColor: '#F05742',
    confirmButtonText: 'Ok, entendi.',
    customClass: {
      confirmButton: 'btn btn-primary-confirm',
    }
  }).then((result) => {

    location.reload()
  })
}

async function setQrCode(storeID) {
  const qrCodeAddress = await getQrCode(storeID);
  const htmlIMG = `<img src="${qrCodeAddress}" alt="QR Code" style="max-width: 100%; max-height: 100%; display: block; margin: 0 auto;">`;
  areaQrCodeCustomer.innerHTML = htmlIMG;

  return qrCodeAddress
}

async function getStoreList() {

  const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/list/store' : configEnv.local_address + `/list/store`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()

  return data.message

}

async function getQrCode(storeID) {

  if (storeID === 0) {

    const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/qrcode' : configEnv.local_address + `/qrcode`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      }
    })
  
    const data = await response.json()

    buttonDownloadQrCode.addEventListener('click', function(event) {
      downloadQrCode(event, data.address);
    })

    return data.address

  } else {

    const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/qrcode' : configEnv.local_address + `/qrcode/${storeID}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      }
    })
  
    const data = await response.json()

    return data.address

  }

}


async function downloadQrCode(event, qrCodeAdress) {

  event.preventDefault()
  
  const qrCodeAddress = qrCodeAdress
  
  const archiveName = qrCodeAddress.split(/qrcode\/|\.png/)

  const response = await fetch(qrCodeAddress)

  const blob = await response.blob()

  const downloadUrl = URL.createObjectURL(blob)

  paramsDownloadQrCode.href = downloadUrl
  paramsDownloadQrCode.setAttribute('download', `QR_CODE_PESQUISA_${archiveName[1]}.png`)

  paramsDownloadQrCode.click()

}

buttonPreviewSurvey.addEventListener('click', openPreviewWindow)

async function getCNPJCompany() {

  const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })

  const data = await response.json()

  return data.cnpj

}

async function openPreviewWindow() {

  const CNPJ = await getCNPJCompany();
  const cleanCNPJ = CNPJ.replace(/[^\d]/g, '');

  const url = `${configEnv.app_mode == 'production' ? npsConfigEnv.web_address : npsConfigEnv.local_address}?cnpj=${cleanCNPJ}`;

  const previewWindow = window.open(url, "_blank", "width=800,height=600");

  return previewWindow

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

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover'
  });
})

const inputIpAllow = document.getElementById('input-allow-ip')

async function requestForAllowIpProtection(allowOrNot) {

  const dataRequest = { lock_by_ip: allowOrNot }

  const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/update/lock-ip`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataRequest)
  })

  const data = await response.json()

}


inputIpAllow.addEventListener('change', (event) => {

  if (inputIpAllow.checked) {

    requestForAllowIpProtection(1)

  } else {

    requestForAllowIpProtection(0)

  }

})

async function setAllowOrNotIpProtection() {

  const allowOrNotIpProtection = await getProductNps()

  if (allowOrNotIpProtection.lock_by_ip === 0) {

    inputIpAllow.checked = false

  } else {

    inputIpAllow.checked = true
  }

}


const backOrNextButton = document.querySelectorAll(".backOrNext")
const backButton = document.getElementById("backButton")
const nextButton = document.getElementById("nextButton")
const selectStore = document.getElementById("storeSelect")
let selectedIndex = selectStore.selectedIndex



async function choiceSelectStoreButtons(wichButtonClicked) {

  const selectedIndex = selectStore.selectedIndex
  const optionsCount = selectStore.options.length

  if (wichButtonClicked === 'nextButton') {

    if (selectedIndex < optionsCount - 1) {

      selectStore.selectedIndex = selectedIndex + 1
      changeSelectButtonState(selectStore.selectedIndex)
      // console.log(selectStore.options[selectStore.selectedIndex].text)
      // console.log('ID do item selecionado:', selectStore.options[selectStore.selectedIndex].value)

      const qrCodeAdress = await setQrCode(selectStore.options[selectStore.selectedIndex].value)

      buttonDownloadQrCode.addEventListener('click', function(event) {
        downloadQrCode(event, qrCodeAdress);
      })



    }

  } else {

    if (selectedIndex > 0) {

      selectStore.selectedIndex = selectedIndex - 1
      changeSelectButtonState(selectStore.selectedIndex)
      // console.log(selectStore.options[selectStore.selectedIndex].text)
      // console.log('ID do item selecionado:', selectStore.options[selectStore.selectedIndex].value)

      const qrCodeAdress = await setQrCode(selectStore.options[selectStore.selectedIndex].value)

      buttonDownloadQrCode.addEventListener('click', function(event) {
        downloadQrCode(event, qrCodeAdress);
      })


    }

  }

}

function changeSelectButtonState(selectedIndex) {

  const optionsIndex = selectStore.options.length - 1

  if (selectedIndex === -1 || selectedIndex === 0) {

    backButton.disabled = true
    nextButton.disabled = false

  } else if (selectedIndex === optionsIndex) {

    nextButton.disabled = true
    backButton.disabled = false

  } else if (selectedIndex === 'disabled') {

    nextButton.disabled = true
    backButton.disabled = true

  } else {

    nextButton.disabled = false
    backButton.disabled = false

  }

}

const spinnerQrCodeSection = document.getElementById('spinner-overlay-qrCodeSection')

backOrNextButton.forEach(button => {
  button.addEventListener('click', (event) => {

    spinnerQrCodeSection.style.display = "flex"

    setTimeout(async () => {

      spinnerQrCodeSection.style.display = "none"
      choiceSelectStoreButtons(button.id)


    }, 1000);
  })
})

selectStore.addEventListener('change', (event) => {

  spinnerQrCodeSection.style.display = "flex"

  setTimeout(async () => {

    spinnerQrCodeSection.style.display = "none"
    //console.log(event.target.options[event.target.selectedIndex].text)
    //console.log('ID do item selecionado:', event.target.value)
    changeSelectButtonState(selectStore.selectedIndex)
    
    const qrCodeAdress = await setQrCode(event.target.value)

    buttonDownloadQrCode.addEventListener('click', function(event) {
      downloadQrCode(event, qrCodeAdress);
    })

  }, 1000);


})

async function createOptionsSelect(dataSelect) {

  const storeSelect = document.getElementById("storeSelect")
  const allowMultiStore = await multiStoreAvailable()

  dataSelect.forEach(item => {

    if (item.active === 1 && allowMultiStore) {

      const option = document.createElement("option")
      option.value = item.id
      option.text = 'LJ ' + item.store_number + " - " + item.name + " - " + item.address
      storeSelect.appendChild(option)

    }
  })

}



async function fillStoresSelect() {

  fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/list/store' : configEnv.local_address + '/list/store', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + tokenCustomer,
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(async data => { 

      if (data.message != 'no-store') {
   
        createOptionsSelect(data.message)

      }

    })

}