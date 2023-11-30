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

async function getNowDateFormatEUA() {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${year}-${month}-${day}`
}

async function getDataQuestionAndAnswersByResearchID(IdResearch) {

    const dataAnswer = await getAnswers()

    const respostasFiltradas = dataAnswer.filter((resposta) => {
        return resposta.research_name === IdResearch;
    })

    const resultado = []

    const questions = await getQuestions()

    respostasFiltradas.forEach((resposta) => {
        const perguntaCorrespondente = questions.allQuestions.find((pergunta) => pergunta.id === resposta.question_id);

        resultado.push(perguntaCorrespondente);
        resultado.push(resposta);
    });

    return resultado
}

async function makePreviewResearchs(researchData) {

    const contentContainer = $('<div></div>')
    let questionViewIndice = 1

    for (let i = 0; i < researchData.length; i += 2) {
        const perguntaContainer = $('<div></div>').addClass('container-pergunta-resposta');
        const perguntaPara = $('<p></p>').html(`<strong>${questionViewIndice} - </strong> ${researchData[i].question_description}`);
        perguntaContainer.append(perguntaPara)
        questionViewIndice++

        const respostaContainer = $('<div></div>').addClass('container-pergunta-resposta');
        const respostaPara = $('<p></p>').html(`<strong>Resposta:</strong> ${researchData[i + 1].answer}`)
        respostaContainer.append(respostaPara)

        contentContainer.append(perguntaContainer).append(respostaContainer)
    }

    const dataResearch = researchData.find(element => {
        if (element.id_research) {
            return element
        }
    })

    const paramsProductNps = await getProductNps()

    const idResearch = dataResearch.id_research.split('.')[0].replace(/[^\w\s]/gi, '')
    const timeResearch = dataResearch.created_at
    const npsAnswer = await getRateTextAndIcon(dataResearch.nps_answer, paramsProductNps.passing_tree)
    const employeeIndicate = `<strong> Colaborador: </strong> ${dataResearch.name_employee === null ? "---" : dataResearch.name_employee}`

    if (researchData[0].title_question === 'FINA. PESQUISA') {
        const newContent = '<p class="modal-title text-center fw-5">O cliente optou por não prosseguir respondendo a pesquisa.</p>'
        return { result: npsAnswer, time: timeResearch, title: idResearch, content: newContent }

    }

    return { result: npsAnswer, time: timeResearch, title: idResearch, content: contentContainer, employee: employeeIndicate }
}

async function viewResearchsListenClicks() {
    const spans = $('.btn-outline-light.rounded-pill.view')

    spans.each(async (index, span) => {

        $(span).on('click', async (event) => {

            const researchData = await getDataQuestionAndAnswersByResearchID($(span).data('id'));
            const { result, time, title, content, employee } = await makePreviewResearchs(researchData)

            const modalTitle = $('#modal-view-researchs .modal-title')
            modalTitle.empty().text(`Pesquisa - ${title}`)

            const modalTime = $('#modal-view-researchs .modal-time')
            modalTime.empty().append(dataAndHourFormat(time))

            const modalResult = $('#modal-view-researchs .modal-result')
            modalResult.empty().append(result)

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

        const modalEmployee = $('#modal-view-researchs .modal-employee')
        modalEmployee.empty()

        const modalResult = $('#modal-view-researchs .modal-result')
        const moreInformationFromResearch = `<p class="fw-bold fs-4"> Contato deixado pelo cliente na pesquisa. </p>`
        modalResult.empty().append(moreInformationFromResearch)

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

async function checkBoxListenClicks() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', (event) => {
            const rowID = event.target.value

            if (rowID === '1') {
                markAllCheckboxes(checkbox.checked)
            }

        })
    })

}

function markAllCheckboxes(checked) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')

    checkboxes.forEach((checkbox) => {
        checkbox.checked = checked
    })
}

function getCheckedRowIDs() {

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedRowIDs = []

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {

            if (checkbox.value === '1') {

                return

            } else {

                const rowID = checkbox.value
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

function printTable(data) {

    //window.print();

}

function exportTable() {

    const table = document.getElementById('table_researchs');
    if (!table) {
        console.error("Tabela não encontrada.");
        return;
    }

    const rows = Array.from(table.querySelectorAll('tr'));

    // Remove a primeira coluna (coluna de input) dos dados
    const data = rows.map((row) => {
        const cells = Array.from(row.children);
        return cells.map((cell, index) => (index !== 0 && cell.innerText ? cell.innerText : null)).filter((cellData) => cellData !== null);
    });

    // Encontra o índice da coluna "Opções"
    const headerRow = rows[0];
    if (!headerRow) {
        console.error("Linha de cabeçalho não encontrada.");
        return;
    }
    const headers = Array.from(headerRow.children).map((cell) => cell.innerText);
    const opcoesColumnIndex = headers.indexOf('Opções');

    // Obtém apenas a coluna "Opções" de cada linha
    const opcoesColumn = rows.map((row) => {
        const cell = row.children[opcoesColumnIndex];
        return cell ? cell.innerText : null;
    });

    const workbook = XLSX.utils.book_new();

    // Converte a coluna "Opções" para o formato da planilha
    const opcoesSheet = XLSX.utils.aoa_to_sheet(opcoesColumn.map((opcao) => [opcao]));

    // Converte o restante dos dados para o formato da planilha
    const dataSheet = XLSX.utils.aoa_to_sheet(data);

    // Anexa ambas as planilhas ao workbook
    XLSX.utils.book_append_sheet(workbook, opcoesSheet, 'Opções');
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Planilha XLS');

    // Converte o workbook para um arquivo binário
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Cria um Blob e gera o arquivo
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    // Cria um link invisível para download e simula o clique
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Pesquisas_Respondidas.xlsx');
    document.body.appendChild(link);
    link.click();
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
                                value="${data.id}" />
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
        }
    });
    
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

// $(document).ready(function () {

//     $(document).on('draw.dt', function () {

//         const paginationButtons = $('.paginate_button')

//         paginationButtons.removeClass('paginate_button item previous disabled my-pagination-style')
//             .addClass('my-pagination-style')
//     })

// });

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
});

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