const tableResearchs = document.getElementById('table_researchs')
const modalViewResearchs = new bootstrap.Modal(document.getElementById('modal-view-researchs'));


async function getAnswers(interval) {

    if (interval) {

        const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + `/answers/${interval[0]}/${interval[1]}` : configEnv.local_address + `/answers/${interval[0]}/${interval[1]}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokenCustomer,
                'Content-Type': 'application/json'
            },
        })

        const dataAnswers = await response.json()

        return dataAnswers.listAnswers

    } else {

        const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + `/answers` : configEnv.local_address + `/answers`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokenCustomer,
                'Content-Type': 'application/json'
            },
        })

        const dataAnswers = await response.json()

        return dataAnswers.listAnswers

    }

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

async function getQuestions() {

    const allQuestions = await questionsRequest()

    const positiveQuestions = allQuestions.filter(question => question.tree_question === 1);
    const negativeQuestions = allQuestions.filter(question => question.tree_question === 0);

    return { allQuestions, positiveQuestions, negativeQuestions }
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

async function getDataCompany() {

    const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
        headers: {
            'Authorization': `Bearer ${tokenCustomer}`
        }
    })

    const data = await response.json()

    return data[0]

}

async function getNowDateFormatEUA() {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${year}-${month}-${day}`
}

async function getTreeByAnswer(questionID) {

    const questions = await getQuestions()

    const treeQuestion = questions.allQuestions.reduce((tree, question) => {
        if (question.id === questionID) {
            return question.tree_question
        }
        return tree
    }, null)

    return treeQuestion
}

async function getDataQuestionAndAnswersByResearchID(IdResearch) {

    const dataAnswer = await getAnswers()

    const answerOfTheResearch = dataAnswer.filter((resposta) => {
        return resposta.research_name === IdResearch
    })

    console.log('answers com filtro de pesquisa', answerOfTheResearch)

    const answerRepeatFiltred = await mergeDuplicateAnswers(answerOfTheResearch)

    console.log('tirando duplicados e mesclando repetidos', answerRepeatFiltred)

    const questionsAndAnswersOderdened = []



    if (answerRepeatFiltred.length <= 1) {

        const treeQuestion = await getTreeByAnswer(answerRepeatFiltred[0].question_id)
        answerRepeatFiltred[0].tree_question = treeQuestion

        questionsAndAnswersOderdened.push(answerRepeatFiltred)


        return questionsAndAnswersOderdened


    } else {

        const questions = await getQuestions()

        answerRepeatFiltred.forEach((resposta) => {
            const perguntaCorrespondente = questions.allQuestions.find((pergunta) => pergunta.id === resposta.question_id);

            if (perguntaCorrespondente && perguntaCorrespondente.type_question !== 'finish') {
                questionsAndAnswersOderdened.push(perguntaCorrespondente);
                questionsAndAnswersOderdened.push(resposta);
            }
        });

        const finalData = await removeDuplicateQuestions(questionsAndAnswersOderdened)

        return finalData

    }



    async function removeDuplicateQuestions(array) {
        const ids = new Set();
        const resultado = [];

        array.forEach(item => {
            if (!ids.has(item.id)) {
                resultado.push(item);
                ids.add(item.id);
            }
        });

        return resultado;
    }

    async function mergeDuplicateAnswers(array) {

        if (array.length === 0) {
            return [];
        }

        array.forEach(answer => {
            if (answer.other_answer.trim() !== '') {
                answer.answer = ` \n\n${answer.answer}\n -> ${answer.other_answer}`;
            }
        });

        const groupedAnswers = {};  

        console.log(array)

        array.forEach((answer, index) => {
            console.log(index)
            const questionId = answer.question_id;
        
            if (!groupedAnswers[questionId]) {
                groupedAnswers[questionId] = { ...answer };
            } else {
                groupedAnswers[questionId].answer = `${groupedAnswers[questionId].answer}\n${answer.answer}`;
                if (answer.name_employee !== '') {
                    if (groupedAnswers[questionId].name_employee !== '') {
                        groupedAnswers[questionId].name_employee += ' |';
                    }
                    groupedAnswers[questionId].name_employee += ` ${answer.name_employee}`;
                }
            }
        });

        const sortedGroupedAnswers = Object.values(groupedAnswers)
            .sort((a, b) => a.id - b.id);

        return sortedGroupedAnswers;
    }


}

async function makePreviewResearchs(researchData) {

    const contentContainer = $('<div></div>')
    let questionViewIndice = 1

    console.log('parâmetro de entrada', researchData)

    async function createQuestionAndAnswersContainer(researchDataForQuestion) {

        for (let i = 0; i < researchDataForQuestion.length; i += 2) {

            const perguntaContainer = $('<div></div>').addClass('container-pergunta-resposta');
            const perguntaPara = $('<p></p>').html(`<strong>${questionViewIndice} - </strong> ${researchDataForQuestion[i].question_description}`);
            perguntaContainer.append(perguntaPara)
            questionViewIndice++

            const respostaContainer = $('<div></div>').addClass('container-pergunta-resposta');
            console.log('resposta da pergunta', researchDataForQuestion[i + 1])
            const respostaPara = $('<p></p>').html(`<strong>Resposta:</strong> ${researchDataForQuestion[i + 1].answer === '' ? '## Não houve resposta. ##' : researchDataForQuestion[i + 1].answer.replace(/\n/g, "<br>")}`);
            respostaContainer.append(respostaPara);

            contentContainer.append(perguntaContainer).append(respostaContainer)
        }

    }

    const dataResearch = researchData.find(element => {
        if (element.id_research) {
            return element
        }
    })

    console.log('dataResearch', dataResearch)

    const paramsProductNps = await getProductNps()

    console.log(researchData[0].nps_answer)

    const idResearch = dataResearch && dataResearch.research_name ? dataResearch.research_name : researchData[0][0].research_name
    const timeResearch = dataResearch && dataResearch.created_at ? dataResearch.created_at : researchData[0][0].created_at
    const npsAnswer = dataResearch ? await getRateTextAndIcon(dataResearch.nps_answer, paramsProductNps.passing_tree) : await getRateTextAndIcon(researchData[0][0].nps_answer, paramsProductNps.passing_tree)
    const npsAnswerNumber = dataResearch && dataResearch.nps_answer !== null ? dataResearch.nps_answer : researchData[0][0].nps_answer
    const employeeIndicate = dataResearch
        ? `<strong>Colaborador(es):</strong> ${verifyStringForEmptyData(dataResearch.name_employee) ? "Não houve indicação." : dataResearch.name_employee}`
        : `<strong>Colaborador(es):</strong> ${verifyStringForEmptyData(researchData[0][0].name_employee) ? "Não houve indicação." : researchData[0][0].name_employee}`

    if (researchData[0].type_question === 'finish' && researchData.length <= 2 || researchData.length <= 2) {

        const newContent = '<p class="modal-title text-center fw-5">O cliente optou por não prosseguir respondendo a pesquisa.</p>'
        return { result: npsAnswer, time: timeResearch, title: idResearch, content: newContent, nps_answer: npsAnswerNumber }

    } else {

        await createQuestionAndAnswersContainer(researchData)

    }

    return { result: npsAnswer, time: timeResearch, title: idResearch, content: contentContainer, employee: employeeIndicate, nps_answer: npsAnswerNumber }
}

async function npsScoreFromLabel(npsScore) {

    switch (npsScore) {
        case 0:
            return "PÉSSIMO";
        case 1:
            return "RUIM";
        case 2:
            return "INDIFERENTE";
        case 3:
            return "BOM"
        case 4:
            return "EXCELENTE"
        default:
            return "Opção inválida";
    }
}

async function viewResearchsListenClicks() {
   
   
    const spans = $('.btn-outline-light.rounded-pill.view')

    spans.each(async (index, span) => {

        $(span).on('click', async (event) => {

            const researchData = await getDataQuestionAndAnswersByResearchID($(span).data('id'));
            const { result, time, title, content, employee, nps_answer } = await makePreviewResearchs(researchData)

            let newNotaNps = nps_answer + 1

            const modalTitle = $('#modal-view-researchs .modal-title')
            modalTitle.empty().text(`Pesquisa - ${title}`)

            const modalTime = $('#modal-view-researchs .modal-time')
            modalTime.empty().append(dataAndHourFormat(time))

            const modalResult = $('#modal-view-researchs .modal-result')
            modalResult.empty().append(result)

            const modalNpsAnswer = $('#modal-npsAnswer')
            modalNpsAnswer.empty().append(` Nota NPS: ${newNotaNps} (${await npsScoreFromLabel(Number(nps_answer))})`)

            const modalEmployee = $('#modal-view-researchs .modal-employee')

            modalEmployee.empty().append(employee)

            const modalBody = $('#modal-view-researchs .modal-body')
            modalBody.empty().append(content)

            $('#modal-view-researchs').modal('show')

            const modalFooter = $('#modal-view-researchs .modal-footer')
            const codeButtonbackModal = `<div class="text-center d-flex justify-content-center">
            <a id="button-back" class="btn btn-primary">Voltar</a>
            </div>`
            modalFooter.empty().append(codeButtonbackModal)

            const buttonbackModal = document.getElementById('button-back')
            buttonbackModal.addEventListener('click', (event) => {
                $('#modal-view-researchs').modal('hide')
            })
        })
    })

}

async function contactResearchsListenClicks() {

    const spansContact = $('.btn-outline-light.rounded-pill.contact');

    spansContact.on('click', async (event) => {

        const span = $(event.currentTarget)

        const dataResearchs = await getResearchList()

        const researchFromContactIcon = dataResearchs.research.find(research => span.data('id') === research.research_name);

        const modalTitle = $('#modal-view-researchs .modal-title');
        modalTitle.empty().text(`Pesquisa - ${researchFromContactIcon.research_name}`);

        const modalTime = $('#modal-view-researchs .modal-time')
        modalTime.empty()

        const modalEmployee = $('#modal-view-researchs .modal-employee')
        modalEmployee.empty()

        const modalResult = $('#modal-view-researchs .modal-result')
        const moreInformationFromResearch = `<p class="fw-bold fs-4"> Contato deixado pelo cliente na pesquisa. </p>`
        modalResult.empty().append(moreInformationFromResearch)

        const modalNpsAnswer = $('#modal-npsAnswer')
        modalNpsAnswer.empty()

        const modalBody = $('#modal-view-researchs .modal-body')

        const contactClientResearch = `<strong><p class="fw-bold fs-4">Telefone: </strong><span> ${researchFromContactIcon.client_phone} </span></p>`;
        const nameClientResearch = `<strong><p class="fw-bold fs-4">Nome: </strong><span> ${researchFromContactIcon.client_name} </span></p>`;

        modalBody.empty().append(nameClientResearch, contactClientResearch)

        $('#modal-view-researchs').modal('show');

        const modalFooter = $('#modal-view-researchs .modal-footer');
        const codeButtonbackModal = `<div class="text-center d-flex justify-content-center">
            <a id="button-back" class="btn btn-primary">Voltar</a>
        </div>`;
        modalFooter.empty().append(codeButtonbackModal);

        const buttonbackModal = document.getElementById('button-back');
        buttonbackModal.addEventListener('click', (event) => {
            $('#modal-view-researchs').modal('hide');
        });
    });
}

async function checkAnyCheckbox(checkboxes) {

    let anyChecked = false

    if (checkboxes) {

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                anyChecked = true;
            }
        });

        if (anyChecked) {
            buttonPrintResearch.disabled = false;
        } else {
            buttonPrintResearch.disabled = true;
        }

    } else {

        const checkboxes = document.querySelectorAll('input[type="checkbox"]')

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                anyChecked = true;
            }
        });

        if (anyChecked) {
            buttonPrintResearch.disabled = false;
        } else {
            buttonPrintResearch.disabled = true;
        }

    }

}

async function checkBoxListenClicks() {

    const checkboxes = document.querySelectorAll('input[type="checkbox"]')

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', async (event) => {

            checkAnyCheckbox(checkboxes)

            const rowID = event.target.value

            if (rowID === '1') {
                markAllCheckboxes(checkbox.checked)
            }

        })
    })

}

async function getDateFromServer () {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/new/date`, {
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const dataServer = await response.json()
    console.log(dataServer)
    return dataServer

}

async function formateDataServer(dataString) {

    console.log(dataString, 'dataString dentro da função')

    const data = new Date(dataString);

    console.log(data, 'date dentro da função')

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} - ${hora}:${minutos}:${segundos}`;
}

async function makePrintResearchData(checkedCheckBoxes) {

    const dataForRequestPrint = []
    const dataCompany = await getDataCompany()
    const dataServer = await getDateFromServer()
    const dataServerFormated = await formateDataServer(dataServer)

    for (const idResearch of checkedCheckBoxes) {

        const questionsAndAnswerComplete = await getDataQuestionAndAnswersByResearchID(idResearch)

        console.log('perguntas e respostas completo', questionsAndAnswerComplete)

        if (questionsAndAnswerComplete.length <= 1) {

            const storeDataForPDF = await getStoreData(questionsAndAnswerComplete[0][0].store_id) 

            const makeDataStoreForPrint = storeDataForPDF.length != 0 ? `${storeDataForPDF[0].store_number} - ${storeDataForPDF[0].name}` : 'MATRIZ'

            const dataEachResearch = {
                "company": dataCompany.fantasy_name,
                "period": dataAndHourFormat(questionsAndAnswerComplete[0][0].created_at),
                "hour_report": dataServerFormated,
                "store_id": makeDataStoreForPrint,
                "logo": `${dataCompany.logo_company === '' ? 'blank.png' : dataCompany.logo_company}`,
                "employee": `${questionsAndAnswerComplete[0][0].name_employee}`,
                "nps_score": `Nota NPS: ${questionsAndAnswerComplete[0][0].nps_answer} - ${await npsScoreFromLabel(Number(questionsAndAnswerComplete[0][0].nps_answer))}`,
                "header": `Pesquisa - ${idResearch}`,
                "tree": questionsAndAnswerComplete[0][0].tree_question,
                "questionAndResponses": ['O cliente optou por não prosseguir respondendo a pesquisa.']
            }

            dataForRequestPrint.push(dataEachResearch)

        } else {

            const questionAndAnswerOnlyImportantText = questionsAndAnswerComplete.filter((object, index, array) => {

                if (object.type_question === 'finish' && array[index + 1] && array[index + 1].answer === '') {
                    return false;
                }

                if (object.type_question === 'finish' && !array[index + 1]) {
                    return false;
                }

                return true;
            }).map(object => {
                return object.question_description || object.answer;
            });

            //console.log('question and answers filtrando finish e etc', questionAndAnswerOnlyImportantText)

            const notaNps = questionsAndAnswerComplete[1].nps_answer + 1

            //console.log(await getStoreData(questionsAndAnswerComplete[1].store_id))
            const storeDataForPDF = await getStoreData(questionsAndAnswerComplete[1].store_id) 

            const makeDataStoreForPrint = storeDataForPDF.length != 0 ? `${storeDataForPDF[0].store_number} - ${storeDataForPDF[0].name}` : 'MATRIZ'


            const dataEachResearch = {
                "company": dataCompany.fantasy_name,
                "period": dataAndHourFormat(questionsAndAnswerComplete[1].created_at),
                "hour_report": dataServerFormated,
                "store_id": makeDataStoreForPrint,
                "logo": dataCompany.logo_company === '' ? 'blank.png' : dataCompany.logo_company,
                "employee": questionsAndAnswerComplete[1].name_employee,
                "nps_score": `Nota NPS: ${notaNps} - ${await npsScoreFromLabel(Number(questionsAndAnswerComplete[1].nps_answer))}`,
                "header": `Pesquisas - ${idResearch}`,
                "tree": questionsAndAnswerComplete[0].tree_question,
                "questionAndResponses": questionAndAnswerOnlyImportantText
            }
            dataForRequestPrint.push(dataEachResearch)
            console.log(dataEachResearch)

        }


    }

    return dataForRequestPrint

}

const buttonPrintResearch = document.getElementById('print-research-button')


buttonPrintResearch.addEventListener('click', async () => {
    
    spinner.classList.add('d-flex');

    setTimeout(async () => {

        spinner.classList.remove('d-flex');

        const checkedCheckBoxes = await getCheckedRowIDs()

        // const underLimitDonwloads = checkedCheckBoxes.length < 11

        // if (underLimitDonwloads) {

            const dataResearch = await makePrintResearchData(checkedCheckBoxes);
            const dataForRequest = await formatDataResearchForRequest(dataResearch);
            const pdfUrls = await requestForPDFDownload(dataForRequest);

            notifyDownloadSuccessPDF()

            await Promise.all(pdfUrls.map(async (url, index) => {
                const fileName = checkedCheckBoxes[index]
                await downloadFileFromURL(url, fileName);
            }))

        // } else {

        //     await notiftyLimitDownloadPDF()

        // }


    }, 1000)

})

async function downloadFileFromURL(fileURL, idPesquisa) {

    const response = await fetch(fileURL)
    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')

    downloadLink.href = downloadUrl
    downloadLink.setAttribute('download', `PESQUISA-NPS_${idPesquisa ?? 'no-file'}.pdf`);

    downloadLink.click()

    URL.revokeObjectURL(downloadUrl)

}


async function formatDataResearchForRequest(oldData) {
    const newDataForRequest = [];

    for (let research of oldData) {
        const arrayTemp = []

        arrayTemp.push(
            {
                "text": research.company,
                "style": "company"
            },
            {
                "text": "Data da Pesquisa: " + research.period,
                "style": "periodo"
            },
            {
                "text": "Data da Impressão: " + research.hour_report,
                "style": "horario_report"
            },
            {
                "text": "Unidade/Loja: " + research.store_id,
                "style": "store"
            },
            {
                "text": research.header,
                "style": "header"
            },
            {
                "image": research.logo,
                "width": 165,
                "absolutePosition": { "x": 350, "y": 60 },
                "style": "logo"
            },
            {
                "text": "Avaliação " + (research.tree == 1 ? "Positiva" : "Negativa"),
                "style": "tree",
                "alignment": "center"
            },
            {
                "image": research.tree == 1 ? "positive.png" : "negative.png",
                "width": 20,
                "absolutePosition": { "x": 280, "y": 220 },
                "style": "negative"
            },
            {
                "text": research.nps_score,
                "style": "nps_score"
            },
            {
                "text": verifyStringForEmptyData(research.employee) || research.employee == null ? "Colaborador Indicado: Não houve Indicação" : `Colaborador(es) Indicado(os): ${research.employee}`,
                "style": "employee"
            }
        );

        if (research.questionAndResponses && research.questionAndResponses.length > 1) {
            let countQuestions = 1;

            for (let i = 0; i < research.questionAndResponses.length; i += 2) {

                arrayTemp.push(
                    {
                        "text": countQuestions + " - " + research.questionAndResponses[i],
                        "style": "question"
                    },
                    {
                        "text": `Resposta: ${research.questionAndResponses[i + 1] === '' ? ' ## Não houve resposta ##' : research.questionAndResponses[i + 1]}`,
                        "style": "response"
                    }
                );
                countQuestions++;
         
            }
        } else {
            arrayTemp.push(
                {
                    "text": "O cliente optou por não prosseguir respondendo a pesquisa!",
                    "style": "noQuestionContainer"
                }
            );
        }

        newDataForRequest.push(arrayTemp);
    }

    return newDataForRequest;

}

function verifyStringForEmptyData(str) {

    if (str) {

        const cleanedStr = str.replace(/\|/g, '')
        const trimmedStr = cleanedStr.trim()
        return trimmedStr.length === 0

    } else {

        return true
    }
}

async function requestForPDFDownload(dataForPDFRequest) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/answer/report`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + tokenCustomer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForPDFRequest)
    })

    const data = await response.json()
    console.log(data)
    return data

}

function markAllCheckboxes(checked) {

    const checkboxes = document.querySelectorAll('input[type="checkbox"]')

    checkboxes.forEach((checkbox) => {
        checkbox.checked = checked
    })

}

async function getCheckedRowIDs() {

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedRowIDs = []

    checkboxes.forEach((checkbox) => {


        if (checkbox.checked) {

            if (checkbox.value === '1') {

                return

            } else {

                const rowID = checkbox.dataset.id
                checkedRowIDs.push(rowID)

            }

        }
    });

    return checkedRowIDs
}

function dataAndHourFormat(dataHora) {

    const [dataPart, horaPart] = dataHora.split('T')

    const [ano, mes, dia] = dataPart.split('-')

    const [hora, minuto, segundo] = horaPart.split(':')

    const dateAndHourFormated = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`

    const [cleanedDataHourAndDate, trash] = dateAndHourFormated.split('.')

    return cleanedDataHourAndDate
}

async function getResearchList(date) {

    if (date) {

        const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/research/${date[0]}/${date[1]}`, {
            headers: {
                'Authorization': 'Bearer ' + tokenCustomer,
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json()

        if (data.message === 'no-research') {
            return []
        }

        return data.research

    } else {

        const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/research`, {
            headers: {
                'Authorization': 'Bearer ' + tokenCustomer,
                'Content-Type': 'application/json'
            },
        })

        const data = await response.json()

        if (data.message === 'no-research') {
            return []
        }

        return data.research

    }

}

document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const todayButton = document.getElementById("todayButton");
    const last30DaysButton = document.getElementById("last30Days");
    const last14DaysButton = document.getElementById("last14Days");
    const last7DaysButton = document.getElementById("last7Days");
    const filterButton = document.getElementById("filterButton");

    const options = {
        dateFormat: "d-m-Y",
        locale: "pt",
    };

    const startDatePicker = flatpickr(startDateInput, {
        ...options,
        onChange: function (selectedDates) {
            endDatePicker.set("minDate", selectedDates[0]);
        },
    });

    const endDatePicker = flatpickr(endDateInput, {
        ...options,
        minDate: "today",
    });

    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    startDatePicker.setDate(last7Days, true);
    endDatePicker.setDate(today, true);

    function clickFilterButton() {
        filterButton.click();

    }

    todayButton.addEventListener("click", function () {
        const today = new Date();
        startDatePicker.setDate(today, true);
        endDatePicker.setDate(today, true);
        markButtonActive(this);
        clickFilterButton();
    });

    last30DaysButton.addEventListener("click", function () {
        const today = new Date();
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);
        startDatePicker.setDate(last30Days, true);
        endDatePicker.setDate(today, true);
        markButtonActive(this);
        clickFilterButton();
    });

    last14DaysButton.addEventListener("click", function () {
        const today = new Date();
        const last14Days = new Date(today);
        last14Days.setDate(today.getDate() - 14);
        startDatePicker.setDate(last14Days, true);
        endDatePicker.setDate(today, true);
        markButtonActive(this);
        clickFilterButton();
    });

    last7DaysButton.addEventListener("click", function () {
        const today = new Date();
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        startDatePicker.setDate(last7Days, true);
        endDatePicker.setDate(today, true);
        markButtonActive(this);
        clickFilterButton();
    });

    filterButton.addEventListener("click", async function () {
        const startDate = startDatePicker.selectedDates[0];
        const endDate = endDatePicker.selectedDates[0];
        const spinnerAnswerTable = document.getElementById('spinner-overlay-answerTable')

        if (startDate && endDate) {

            const dateIntervalForRequest = [formatDateToUS(startDate.toLocaleDateString()), formatDateToUS(endDate.toLocaleDateString())]

            const dataResearchs = await getResearchList(dateIntervalForRequest)

            spinnerAnswerTable.classList.add('d-flex')

            setTimeout(async () => {

                spinnerAnswerTable.classList.remove('d-flex')

                if (dataResearchs.length === 0) {
                    await populateTable(dataResearchs)
                } else {
                    await populateTable(dataResearchs.research)
                }

            }, 800)

        }

    })

    function markButtonActive(button) {
        [todayButton, last30DaysButton, last14DaysButton, last7DaysButton].forEach(function (btn) {
            btn.classList.remove("active");
        });
        button.classList.add("active");
    }

    last7DaysButton.click()

})

async function getRateTextAndIcon(npsAnswer, passingTree) {

    if (npsAnswer >= passingTree) {
        return 'Positiva <i class="bi bi-hand-thumbs-up text-success"></i>';
    } else {
        return 'Negativa <i class="bi bi-hand-thumbs-down text-danger"></i>';
    }

}

async function populateTable(dataResearch) {

    const table = $('#table_researchs');

    if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().clear().destroy();
    }

    const dataWithIndices = dataResearch.map((row, index) => ({
        ...row,
        index
    }));

    const paramsProductNps = await getProductNps()

    const modifiedDataArray = await Promise.all(dataWithIndices.map(async row => {
        const modifiedRow = {
            ...row,
            nps_answer: await getRateTextAndIcon(row.nps_answer, paramsProductNps.passing_tree)
        };
        return modifiedRow;
    }));


    table.DataTable({
        data: modifiedDataArray,
        columns: [
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
                            <input class="form-check-input" type="checkbox" data-kt-check="true"
                                data-kt-check-target="#kt_datatable_example_1 .form-check-input"
                                value="${data.id}" data-id="${data.research_name}" />
                        </div>`;
                }
            },
            { data: 'formatted_date' },
            { data: 'research_name', className: 'research-column' },
            { data: 'nps_answer', title: 'AVALIAÇÃO' },
            {
                data: 'store_number',
                title: 'LOJA',
                render: function (data) {
                    if (data === null) {
                        return `-`;
                    } else {
                        return `LOJA ${data}`;
                    }

                }
            },
            {
                data: null,
                orderable: false,
                render: function (data) {
                    return `
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-sm btn-outline-light rounded-pill view" data-id="${data.research_name}">
                                <i class="bi bi-card-text bi-lg cursor-pointer" data-id="${data.research_name}"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-light rounded-pill contact" data-id="${data.research_name}" data-contact="${data.is_contact}">
                                <i class="bi bi-person-check bi-lg cursor-pointer" data-id="${data.research_name}" data-contact="${data.is_contact}"></i>
                            </button>
                        </div>`;
                }
            }
        ],
        order: [[2, 'desc']],
        paging: true,
        pagingType: 'simple_numbers',
        searching: false,
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        language: {
            paginate: {
                first: "Primeira",
                last: "Última",
                next: "Próxima",
                previous: "Anterior"
            },
            lengthMenu: "Mostrar _MENU_ registros por página",
            search: "Pesquisar:",
            zeroRecords: "Não há pesquisas a exibir para o filtro informado.",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoFiltered: "(filtrado de _MAX_ registros no total)",
            infoEmpty: ""
        },
        drawCallback: function (settings) {
            disabledButtonsNoContact();
            checkBoxListenClicks();
            viewResearchsListenClicks();
            contactResearchsListenClicks();
            checkAnyCheckbox();
        }
    });

    const spinnerAnswerTable = document.getElementById('spinner-overlay-answerTable')

    table.on('page.dt', function () {
        spinnerAnswerTable.classList.add('d-flex')
        setTimeout(async () => {
            spinnerAnswerTable.classList.remove('d-flex')
        }, 800)
    })

    table.on('length.dt', function () {
        spinnerAnswerTable.classList.add('d-flex')
        setTimeout(async () => {
            spinnerAnswerTable.classList.remove('d-flex')
        }, 800)
    })

}

async function disabledButtonsNoContact() {
    const buttonsContact = document.querySelectorAll('.btn-outline-light.rounded-pill.contact');

    buttonsContact.forEach(eachButton => {
        const dataContact = eachButton.dataset.contact

        if (dataContact === "0") {
            eachButton.setAttribute('disabled', true)
        }
    })

}

function formatDateToUS(date) {
    const [day, month, year] = date.split('/').map(part => part.trim());
    return `${year}-${month}-${day}`;
}

$(document).ready(function () {
    $(document).on('draw.dt', function () {
        const paginationButtons = $('.paginate_button');

        paginationButtons.removeClass('paginate_button item previous disabled my-pagination-style')
            .addClass('my-pagination-style');

        paginationButtons.each(function () {
            if ($(this).attr('id') === 'table_researchs_ellipsis') {
                $(this).off('click').addClass('not-clickable');
            }
        });
    });
})

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

async function notifyDownloadSuccessPDF() {

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Os downloads iniciarão em breve!",
        showConfirmButton: false,
        timer: 1500
    });


}

async function notiftyLimitDownloadPDF() {

    Swal.fire({
        title: 'Limite de Download.',
        text: 'O download só é permitido para até 10 pesquisas simultâneas. Desmarque as pesquisa excedentes.',
        icon: 'warning',
        confirmButtonColor: '#F05742',
        confirmButtonText: 'Ok, entendi.',
        customClass: {
            confirmButton: 'btn btn-primary-confirm',
        }
    })


}

async function getStoreList() {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/list/store`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      }
    })
  
    const data = await response.json()
    console.log(data)
    return data.message
  
}

async function getStoreData (storeID) {

    const storeList = await getStoreList()

    const store = storeList.filter(store => store.id === storeID)

    return store

}