const selectStore = document.getElementById("storeSelect");

// BUSCA DADOS
document.addEventListener('DOMContentLoaded', async () => {
  const allowMultiStore = await multiStoreAvailable()

  if (allowMultiStore) {

    await fillStoresSelect()

    let selectedIndex = selectStore.selectedIndex
    changeSelectButtonState(selectedIndex)

    reloadStaticCharts()
    const dateIntervalInitial = await getDatesForLast7Days()

    reloadAllCharts(dateIntervalInitial)

  } else {

    selectStore.disabled = true
    changeSelectButtonState('disabled')

    const detailsCompany = await getDetailsCompany()

    console.log(detailsCompany)

    const option = document.createElement("option")
    option.value = 0
    option.textContent = `${detailsCompany[0].corporate_name}`
    selectStore.appendChild(option)

    reloadStaticCharts()
    const dateIntervalInitial = await getDatesForLast7Days()

    reloadAllCharts(dateIntervalInitial)


  }

});

async function getDetailsCompany() {

  const response = await fetch(configEnv.app_mode == 'production' ? configEnv.web_address + '/details' : configEnv.local_address + '/details', {
    headers: {
      'Authorization': `Bearer ${tokenCustomer}`
    }
  })

  const data = await response.json()

  return data


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

      createOptionsSelect(data.message)


    })

}

///////////////////////////////////////////////////////////////////////////////
//// PESQUISAS POSITIVAS E NEGATIVAS

async function chartDonutPositiveAndNegativeResearchs(dataArray) {

  const positiveValue = dataArray[0];
  const negativeValue = dataArray[1];
  const ratingResearchValue = dataArray[2];
  const totalValue = positiveValue + negativeValue;
  const percentPositiveValue = (dataArray[0] / totalValue) * 100;
  const percentNegativeValue = (dataArray[1] / totalValue) * 100;

  const ctx = document.getElementById('donutChart').getContext('2d');

  // Verifique se todos os valores no array são iguais a zero
  const allZeros = dataArray.every(value => value === 0);

  if (allZeros) {
    // Se todos os valores forem zeros, não crie o gráfico
    document.getElementById('no-data-field-amount-chart').innerText = 'Não há dados disponíveis.'
    document.getElementById('more-information-amount-chart-field').classList.add('d-none')
    document.getElementById('no-data-field-amount-chart').classList.add('empty-data')
    document.getElementById('donutChart').classList.add('d-none')
    return
  }

  // Remova a mensagem de "Não há dados disponíveis." se estiver presente
  document.getElementById('no-data-field-amount-chart').innerText = ''
  document.getElementById('more-information-amount-chart-field').classList.remove('d-none')
  document.getElementById('no-data-field-amount-chart').classList.remove('empty-data')
  document.getElementById('donutChart').classList.remove('d-none')




  // Verifique se há um gráfico existente no elemento de tela e destrua-o, se necessário
  if (window.myDonutChart) {
    window.myDonutChart.destroy();
  }

  const data = {
    labels: ['Avaliação Positiva', 'Avaliação Negativa'],
    datasets: [{
      data: [positiveValue, negativeValue],
      backgroundColor: ['rgba(76, 175, 80, 0.7)', 'rgba(252, 41, 18, 0.7)'],
    }],
  };

  const options = {
    responsive: true,
    legend: {
      position: 'top',
    },
  };

  // Crie o novo gráfico no mesmo elemento de tela
  window.myDonutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options,
  });

  const positiveCount = document.getElementById('positiveCount');
  const negativeCount = document.getElementById('negativeCount');
  const totalCount = document.getElementById('totalCount');
  const positivePercentageInput = document.getElementById('positivePercentage');
  const negativePercentageInput = document.getElementById('negativePercentage');
  const ratingResearchInput = document.getElementById('rating-research');

  positiveCount.innerText = positiveValue;
  negativeCount.innerText = negativeValue;
  totalCount.innerText = totalValue;
  positivePercentageInput.innerText = percentPositiveValue.toFixed(2) === 'NaN' ? '0%' : `${percentPositiveValue.toFixed(2)}%`;
  negativePercentageInput.innerText = percentNegativeValue.toFixed(2) === 'NaN' ? '0%' : `${percentNegativeValue.toFixed(2)}%`;
  ratingResearchInput.innerText = ratingResearchValue;
}

////////////////////////////////////////////////////////////////////////////////
//// VOLUME DE PESQUISAS

async function chartLinesVolumResearch(researchForADay, oldDataResearch, storeID) {

  const allZerosActualDays = researchForADay.every(value => value === 0);
  const allZerosPastDays = oldDataResearch.every(value => value === 0);

  if (allZerosActualDays && allZerosPastDays) {
    document.getElementById('no-data-field-days-chart').innerText = 'Não há dados disponíveis.'
    document.getElementById('more-information-days-chart-field').classList.add('d-none')
    document.getElementById('no-data-field-days-chart').classList.add('empty-data')
    document.getElementById('lineChart').classList.add('d-none')
    return
  }

  document.getElementById('no-data-field-days-chart').innerText = ''
  document.getElementById('more-information-days-chart-field').classList.remove('d-none')
  document.getElementById('no-data-field-days-chart').classList.remove('empty-data')
  document.getElementById('lineChart').classList.remove('d-none')


  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const today = new Date();

  const last7DaysLabels = [];
  const last7DaysData = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayOfWeek = day.getDay();
    const label = `${daysOfWeek[dayOfWeek]}\n${day.getDate()}/${day.getMonth() + 1}`;

    // Calcular o índice correto para researchForADay com base no dia da semana
    const researchIndex = 6 - i; // Calcula o índice de forma decrescente

    last7DaysData.push(researchForADay[researchIndex]);

    // Inserir o rótulo na posição correta
    last7DaysLabels.unshift(label); // Insere no início do array
  }

  const totalResearchForA7DaysValue = last7DaysData.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const totalOldResearchValue = oldDataResearch.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const medResearchForADayValue = totalResearchForA7DaysValue / researchForADay.length
  const diffTotalResearchValue = ((totalResearchForA7DaysValue / totalOldResearchValue) - 1) * 100


  const dataDays = {
    labels: last7DaysLabels,
    datasets: [{
      label: "Pesquisas Respondidas",
      data: last7DaysData,
      borderColor: "#F05742",
      backgroundColor: "rgba(240, 87, 66, 0.2)",
      fill: true
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false // Remove o rótulo
      }
    }
  };

  const ctxDays = document.getElementById("lineChart").getContext("2d");

  // Verifique se o gráfico já existe
  if (window.myLineChart) {
    // Se existir, destrua-o
    window.myLineChart.destroy();
  }

  const chartDays = new Chart(ctxDays, {
    type: "line",
    data: dataDays,
    options: options
  });

  // Armazene a instância do gráfico globalmente
  window.myLineChart = chartDays;

  const research7DaysResearchField = document.getElementById('7daysVolumResearchs');
  const medResearchForADayField = document.getElementById('medADayVolumResearchs');
  const compareResearchOldField = document.getElementById('compareVolumResearchs');


  research7DaysResearchField.innerHTML = totalResearchForA7DaysValue
  medResearchForADayField.innerHTML = medResearchForADayValue.toFixed(1)
  compareResearchOldField.innerHTML = await formatNumberIfPositiveOrNegative(diffTotalResearchValue.toFixed(2))

}

async function chartBarsVolumeResearchMonth(monthVolumResearchs) {

  const allZeros = monthVolumResearchs.every(value => value === 0)

  if (allZeros) {
    document.getElementById('no-data-field-month-chart').innerText = 'Não há dados disponíveis.'
    document.getElementById('more-information-month-chart-field').classList.add('d-none')
    document.getElementById('no-data-field-month-chart').classList.add('empty-data')
    document.getElementById('barChart').classList.add('d-none')
    return
  }

  document.getElementById('no-data-field-month-chart').innerText = ''
  document.getElementById('more-information-month-chart-field').classList.remove('d-none')
  document.getElementById('no-data-field-month-chart').classList.remove('empty-data')
  document.getElementById('barChart').classList.remove('d-none')

  const totalResearchForAllMonthsValue = monthVolumResearchs.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const medResearchForAMonthValue = totalResearchForAllMonthsValue / monthVolumResearchs.length;
  const bestMonthIndex = monthVolumResearchs.indexOf(Math.max(...monthVolumResearchs))
  const triSumMonth = [
    monthVolumResearchs.slice(0, 3).reduce((sum, value) => sum + value, 0),
    monthVolumResearchs.slice(3).reduce((sum, value) => sum + value, 0)
  ]

  const rateCompareTriMonth = ((triSumMonth[1] / triSumMonth[0]) - 1) * 100

  const currentDate = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    const monthName = month.toLocaleString('default', { month: 'long' });
    months.push(monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase());
  }

  const data = {
    labels: months,
    datasets: [{
      data: monthVolumResearchs,
      backgroundColor: '#F05742',
      borderColor: '#F05742',
      borderWidth: 1
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  // Obtenha o elemento canvas
  const ctx = document.getElementById('barChart').getContext('2d');

  // Verifique se o gráfico de barras já existe
  if (window.myBarChart) {
    // Se existir, destrua-o
    window.myBarChart.destroy();
  }

  // Crie um novo gráfico de barras
  const chartBars = new Chart(ctx, config);

  // Armazene a instância do gráfico de barras globalmente
  window.myBarChart = chartBars;


  const medMonthResearchField = document.getElementById('medMonthVolumResearchs');
  const bestMonthVolumeResearchField = document.getElementById('bestMonthVolumeResearch');
  const compareResearchTriField = document.getElementById('compareTriMonthVolumResearchs');

  medMonthResearchField.innerHTML = medResearchForAMonthValue.toFixed(1);
  compareResearchTriField.innerHTML = await formatNumberIfPositiveOrNegative(rateCompareTriMonth.toFixed(2))

  const bestMonthLabel = `${monthVolumResearchs[bestMonthIndex]} - ${months[bestMonthIndex]}`;
  bestMonthVolumeResearchField.innerHTML = bestMonthLabel;
}

//////////////////////////////////////////////////////////////////////////////
/// DEPARTAMENTOS, TÓPICOS E COLABORADORES


const chartPositiveInstances = {}; // Objeto para armazenar as instâncias dos gráficos

async function chartBarsPositiveHall(data, idChart) {
  const orderedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, value], index) => {
      if (index < 10) {
        acc[key] = value;
      }
      return acc;
    }, {});

  const labels = Object.keys(orderedData);
  const values = Object.values(orderedData);

  const formatXAxisLabel = (value, index) => {
    let starIcon;
    if (index === 0) {
      starIcon = '🥇 ';
    } else if (index === 1) {
      starIcon = '🥈 ';
    } else if (index === 2) {
      starIcon = '🥉 ';
    } else {
      starIcon = '';
    }
    return starIcon + value;
  };

  // Se já existe uma instância do gráfico com este ID, atualize-a, senão, crie um novo gráfico
  if (chartPositiveInstances[idChart]) {
    chartPositiveInstances[idChart].update({
      xAxis: {
        categories: labels,
        labels: {
          formatter: function () {
            return formatXAxisLabel(this.value, this.axis.categories.indexOf(this.value));
          },
        },
      },
      series: [{
        data: values,
      }],
    });
  } else {
    chartPositiveInstances[idChart] = Highcharts.chart(idChart, {
      chart: {
        type: 'bar',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: labels,
        labels: {
          formatter: function () {
            return formatXAxisLabel(this.value, this.axis.categories.indexOf(this.value));
          },
        },
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          enabled: false,
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          groupPadding: 0.1,
          animation: true, // Ativar a animação de entrada
        },
      },
      series: [{
        name: 'Menções',
        data: values,
        color: 'rgba(54, 235, 83, 0.6)',
        showInLegend: false,
      }],
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      }
    });
  }
}




const chartNegativeInstances = {};

async function chartBarsNegativeHall(data, idChart) {
  const orderedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, value], index) => {
      if (index < 10) {
        acc[key] = value;
      }
      return acc;
    }, {});

  const labels = Object.keys(orderedData);
  const values = Object.values(orderedData);

  const formatXAxisLabel = (value, index) => {
    let starIcon;
    if (index === 0) {
      starIcon = '🥇 ';
    } else if (index === 1) {
      starIcon = '🥈 ';
    } else if (index === 2) {
      starIcon = '🥉 ';
    } else {
      starIcon = '';
    }
    return starIcon + value;
  };

  // Se já existe uma instância do gráfico com este ID, atualize-a, senão, crie um novo gráfico
  if (chartNegativeInstances[idChart]) {
    chartNegativeInstances[idChart].update({
      xAxis: {
        categories: labels,
        labels: {
          formatter: function () {
            return formatXAxisLabel(this.value, this.axis.categories.indexOf(this.value));
          },
        },
      },
      series: [{
        data: values,
      }],
    });
  } else {
    chartNegativeInstances[idChart] = Highcharts.chart(idChart, {
      chart: {
        type: 'bar',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: labels,
        labels: {
          formatter: function () {
            return formatXAxisLabel(this.value, this.axis.categories.indexOf(this.value));
          },
        },
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          enabled: false,
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          groupPadding: 0.1,
        },
      },
      series: [{
        name: 'Menções',
        data: values.map(value => -value),
        color: 'rgba(235, 54, 98, 0.6)',
        showInLegend: false,
      }],
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      }
    });
  }
}

async function chartNPSIndicator([promoter, passive, detractors]) {

  const allZeros = [promoter, passive, detractors].every(value => value === 0);

  if (allZeros) {
    // Se todos os valores forem zeros, não crie o gráfico
    document.getElementById('no-data-field-nps-chart').innerText = 'Não há dados disponíveis.'
    document.getElementById('more-information-nps-chart-field').classList.add('d-none')
    document.getElementById('no-data-field-nps-chart').classList.add('empty-data')
    document.getElementById('custom-text-div').classList.add('d-none')
    document.getElementById('canvas-id').classList.add('d-none')
    return
  }

  // Remova a mensagem de "Não há dados disponíveis." se estiver presente
  document.getElementById('no-data-field-nps-chart').innerText = ''
  document.getElementById('more-information-nps-chart-field').classList.remove('d-none')
  document.getElementById('no-data-field-nps-chart').classList.remove('empty-data')
  document.getElementById('custom-text-div').classList.remove('d-none')
  document.getElementById('canvas-id').classList.remove('d-none')

  let gauge = new RadialGauge({
    renderTo: 'canvas-id',
    width: 300,
    height: 350,
    title: "NPS Score",

    startAngle: 90,
    ticksAngle: 180,

    colorUnits: "#3CA7DB",
    colorNumbers: "#534638",
    colorNeedle: "#232829",
    colorNeedleEnd: "#232829",
    colorNeedleCircleOuter: "#232829",
    colorNeedleCircleOuterEnd: "#232829",

    colorNeedleShadowUp: "#232829",
    colorNeedleShadowDown: "#232829",

    colorMajorTicks: ["#959b9c", "#959b9c", "#959b9c", "#959b9c", "#959b9c", "#959b9c"],
    colorMinorTicks: "#959b9c",

    minValue: -100,
    maxValue: 100,
    majorTicks: ["Detratores", "", "Neutros", "", "Promotores"],
    minorTicks: "2",
    strokeTicks: true,
    highlights: [
      {
        "from": -100,
        "to": 0,
        "color": "#FF6666"
      },
      {
        "from": 0,
        "to": 100,
        "color": "#99FFCC"
      }
    ],

    highlightsWidth: 25,
    numbersMargin: 12,

    animation: true,
    animationRule: "linear",
    animatedValue: true,

    borders: false,
    valueBox: false,

    needleType: "arrow",
    needleEnd: 65,
    needleWidth: 4,
    needleCircleSize: 8,
    needleCircleInner: false,
    needleCircleOuter: true,
    needleShadow: false,

    borderShadowWidth: 0
  }).draw()

  const detractorNumberField = document.getElementById('npsDetractorNumber')
  const detractorPercNumberField = document.getElementById('npsDetractorPerc')
  const passiveNumberField = document.getElementById('npsPasiveNumber')
  const passivePercNumberField = document.getElementById('npsPasivePerc')
  const promoterNumberField = document.getElementById('npsPromoterNumber')
  const promoterPercNumberField = document.getElementById('npsPromoterPerc')

  const sumNpsNotes = detractors + passive + promoter

  detractorNumberField.innerHTML = detractors
  const percDetractorNumber = isNaN(((detractors / sumNpsNotes) * 100).toFixed(2)) ? 0 : ((detractors / sumNpsNotes) * 100).toFixed(2)
  detractorPercNumberField.innerHTML = percDetractorNumber + '%'

  passiveNumberField.innerHTML = passive
  const percPassiveNumber = isNaN(((passive / sumNpsNotes) * 100).toFixed(2)) ? 0 : ((passive / sumNpsNotes) * 100).toFixed(2)
  passivePercNumberField.innerHTML = percPassiveNumber + '%'

  const percPromoterNumber = isNaN(((promoter / sumNpsNotes) * 100).toFixed(2)) ? 0 : ((promoter / sumNpsNotes) * 100).toFixed(2)
  promoterNumberField.innerHTML = promoter
  promoterPercNumberField.innerHTML = percPromoterNumber + '%'

  const npsScore = isNaN(percPromoterNumber - percDetractorNumber) ? 0 : percPromoterNumber - percDetractorNumber;

  gauge.value = npsScore
  gauge.update()

  // Atualize o texto e a classe CSS com base no valor
  let customTextDiv = document.getElementById('custom-text-div')
  customTextDiv.textContent = npsScore.toFixed(2).toString()

  if (npsScore > 0) {
    customTextDiv.classList.remove('negative')
    customTextDiv.textContent = "+" + customTextDiv.textContent
  } else if (npsScore < 0) {
    customTextDiv.classList.add('negative')
    customTextDiv.style.backgroundImage = 'linear-gradient(45deg, #FF0000, #8B0000)'
  } else {
    customTextDiv.style.backgroundImage = 'linear-gradient(45deg, #FFFFE0, #FFFF00)'
  }

}


///////////////////////////////////////////////////////////////////////////////////////////////////
//////// DADOS PARA OS GRÁFICOS

async function getDepartmentDataChart(date, storeNumber) {

  if (storeNumber && storeNumber != 0) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/topic/by/departments/${date[0]}/${date[1]}/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()
    console.log(data)
    if (data.message) {

      return data.message

    } else {

      return data
    }


  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/topic/by/departments/${date[0]}/${date[1]}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()
    console.log(data)
    if (data.message) {

      return data.message

    } else {

      return data
    }

  }


}


async function getDepartmentRankDataChart(date, tree, storeNumber) {


  if (storeNumber && storeNumber != 0) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/department/${date[0]}/${date[1]}/${tree}/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data.departments

  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/department/${date[0]}/${date[1]}/${tree}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data.departments

  }


}

async function getTopicDataChart(date, tree, storeNumber) {


  if (storeNumber && storeNumber != 0) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/topics/${date[0]}/${date[1]}/${tree}/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data.topics

  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/topics/${date[0]}/${date[1]}/${tree}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data.topics

  }


}

async function getEmployeeDataChart(date, tree, storeNumber) {

  if (storeNumber && storeNumber != 0) {


    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/employee/${date[0]}/${date[1]}/${tree}/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()
    console.log(data.employees)
    return data.employees

  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/employee/${date[0]}/${date[1]}/${tree}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()
    console.log(data.employees)

    return data.employees

  }



}

async function getPositiveAndNegativeResearchesDataChart(date, storeNumber) {

  if (storeNumber && storeNumber != 0) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/research/${date[0]}/${date[1]}/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    if (data) {
      return [data[0], data[1], data[2] === null ? 0 : data[2].toFixed(2)]
    }


  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/research/${date[0]}/${date[1]}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    if (data) {
      return [data.to[0], data.to[1], data.to[2] === null ? 0 : data.to[2].toFixed(2)]
    }

  }

}

async function getAmountMonthResearchesDataChart(storeNumber) {

  if (storeNumber && storeNumber != 0) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/amount/month/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })


    const data = await response.json()

    return data

  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/amount/month/`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })


    const data = await response.json()

    return data

  }

}

async function getAmountDaysResearchesDataChart(storeNumber) {

  if (storeNumber && storeNumber != 0) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/amount/research/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data


  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/amount/research/`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data

  }

}

async function getNpsDataChart(date, storeNumber) {

  if (storeNumber && storeNumber != 0) {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/amount/nps/${date[0]}/${date[1]}/${storeNumber}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data


  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/amount/nps/${date[0]}/${date[1]}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })

    const data = await response.json()

    return data


  }

}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////// FUNÇÕES AUXILIARES

function formatDateToUS(date) {
  const [day, month, year] = date.split('/').map(part => part.trim());
  return `${year}-${month}-${day}`;
}

async function formatNumberIfPositiveOrNegative(number) {

  let formattedNumber = ""

  if (number > 0 && isFinite(number)) {

    formattedNumber = `
    <span class="badge badge-success fs-base">
			<span class="svg-icon svg-icon-5 svg-icon-white ms-n1">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<rect opacity="0.5" x="13" y="6" width="13" height="2" rx="1" transform="rotate(90 13 6)" fill="black" />
					<path d="M12.5657 8.56569L16.75 12.75C17.1642 13.1642 17.8358 13.1642 18.25 12.75C18.6642 12.3358 18.6642 11.6642 18.25 11.25L12.7071 5.70711C12.3166 5.31658 11.6834 5.31658 11.2929 5.70711L5.75 11.25C5.33579 11.6642 5.33579 12.3358 5.75 12.75C6.16421 13.1642 6.83579 13.1642 7.25 12.75L11.4343 8.56569C11.7467 8.25327 12.2533 8.25327 12.5657 8.56569Z" fill="black" />
				</svg>
			</span>
					${number}%</span>`

  } else if (!isFinite(number)) {

    formattedNumber = `
    <span class="badge badge-success fs-base">
			<span class="svg-icon svg-icon-5 svg-icon-white ms-n1">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<rect opacity="0.5" x="13" y="6" width="13" height="2" rx="1" transform="rotate(90 13 6)" fill="black" />
					<path d="M12.5657 8.56569L16.75 12.75C17.1642 13.1642 17.8358 13.1642 18.25 12.75C18.6642 12.3358 18.6642 11.6642 18.25 11.25L12.7071 5.70711C12.3166 5.31658 11.6834 5.31658 11.2929 5.70711L5.75 11.25C5.33579 11.6642 5.33579 12.3358 5.75 12.75C6.16421 13.1642 6.83579 13.1642 7.25 12.75L11.4343 8.56569C11.7467 8.25327 12.2533 8.25327 12.5657 8.56569Z" fill="black" />
				</svg>
			</span>
					${0}%</span>`

  } else {

    formattedNumber = `
    <span class="badge badge-danger fs-base">
    <span class="svg-icon svg-icon-5 svg-icon-white ms-n1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect opacity="0.5" x="11" y="18" width="13" height="2" rx="1" transform="rotate(-90 11 18)" fill="black" />
        <path d="M11.4343 15.4343L7.25 11.25C6.83579 10.8358 6.16421 10.8358 5.75 11.25C5.33579 11.6642 5.33579 12.3358 5.75 12.75L11.2929 18.2929C11.6834 18.6834 12.3166 18.6834 12.7071 18.2929L18.25 12.75C18.6642 12.3358 18.6642 11.6642 18.25 11.25C17.8358 10.8358 17.1642 10.8358 16.75 11.25L12.5657 15.4343C12.2533 15.7467 11.7467 15.7467 11.4343 15.4343Z" fill="black" />
      </svg>
    </span>
    ${number}%</span>`
  }

  return formattedNumber
}

const getDatesForLast7Days = async () => {
  const endDate = moment()
  const startDate = moment().subtract(7, 'days')
  return [formatDateToUS(startDate.format('DD/MM/YYYY')), formatDateToUS(endDate.format('DD/MM/YYYY'))]
}

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover'
  })
})

async function reloadAllCharts(dateInterval, storeNumber) {

  // RANKING DEPARTAMENT CHARTS

  const getDataPositiveDepartaments = await getDepartmentRankDataChart(dateInterval, 1, storeNumber)
  const getDataNegativeDepartaments = await getDepartmentRankDataChart(dateInterval, 0, storeNumber)

  const isEmptyObjectDepartamentsPositive = Object.keys(getDataPositiveDepartaments).length === 0;
  const isEmptyObjectDepartamentsNegative = Object.keys(getDataNegativeDepartaments).length === 0;

  if (isEmptyObjectDepartamentsPositive && isEmptyObjectDepartamentsNegative) {

    const cardRankingDepartment = document.getElementById('card-ranking-department-chart')

    cardRankingDepartment.style.display = "none"

  } else {

    const cardRankingDepartment = document.getElementById('card-ranking-department-chart')
    cardRankingDepartment.style.display = "flex"

    const spinnerRankingDepartment = document.getElementById('spinner-overlay-ranking-department')

    spinnerRankingDepartment.style.display = "flex"

    setTimeout(async () => {

      spinnerRankingDepartment.style.display = "none"



      await chartBarsPositiveHall(getDataPositiveDepartaments, 'departmentBarChartPositive')
      await chartBarsNegativeHall(getDataNegativeDepartaments, 'departmentBarChartNegative')



    }, 1000)

  }

  // TOPIC CHARTS

  const getDataPositiveTopics = await getTopicDataChart(dateInterval, 1, storeNumber)
  const getDataNegativeTopics = await getTopicDataChart(dateInterval, 0, storeNumber)

  const isEmptyObjectTopicsPositive = Object.keys(getDataPositiveTopics).length === 0;
  const isEmptyObjectTopicsNegative = Object.keys(getDataNegativeTopics).length === 0;

  if (isEmptyObjectTopicsPositive && isEmptyObjectTopicsNegative) {

    const cardRankingTopic = document.getElementById('card-topic-chart')

    cardRankingTopic.style.display = "none"

  } else {

    const cardRankingTopic = document.getElementById('card-topic-chart')
    cardRankingTopic.style.display = "flex"

    const spinnerTopic = document.getElementById('spinner-overlay-topic')

    spinnerTopic.style.display = "flex"

    setTimeout(async () => {

      spinnerTopic.style.display = "none"


      await chartBarsPositiveHall(getDataPositiveTopics, 'topicBarChartPositive')
      await chartBarsNegativeHall(getDataNegativeTopics, 'topicBarChartNegative')

    }, 1000)

  }

  // EMPLOYEE CHARTS

  const getDataPositiveEmployee = await getEmployeeDataChart(dateInterval, 1, storeNumber);
  const getDataNegativeEmployee = await getEmployeeDataChart(dateInterval, 0, storeNumber);

  const isEmptyObjectEmployeePositive = Object.keys(getDataPositiveEmployee).length === 0;
  const isEmptyObjectEmployeeNegative = Object.keys(getDataNegativeEmployee).length === 0;

  if (isEmptyObjectEmployeePositive && isEmptyObjectEmployeeNegative) {

    const containerRankingTopicChart = document.getElementById('card-employee-chart')

    containerRankingTopicChart.style.display = "none"

  } else {

    const containerRankingTopicChart = document.getElementById('card-employee-chart')

    containerRankingTopicChart.style.display = "flex"

    const spinnerEmployee = document.getElementById('spinner-overlay-employee')

    spinnerEmployee.style.display = "flex"

    setTimeout(async () => {

      spinnerEmployee.style.display = "none"

      await chartBarsPositiveHall(getDataPositiveEmployee, 'employeeBarChartPositive')
      await chartBarsNegativeHall(getDataNegativeEmployee, 'employeeBarChartNegative')

    }, 1000)

  }

  // POSITIVE AND NEGATIVE COUNT CHART

  const spinnerPositiveAndNegative = document.getElementById('spinner-overlay-positiveAndNegative')

  spinnerPositiveAndNegative.style.display = "flex"

  setTimeout(async () => {

    spinnerPositiveAndNegative.style.display = "none"

    const getDataResearches = await getPositiveAndNegativeResearchesDataChart(dateInterval, storeNumber)
    await chartDonutPositiveAndNegativeResearchs(getDataResearches)


  }, 1000)

  // NPS CHART

  const spinnerNps = document.getElementById('spinner-overlay-nps')

  spinnerNps.style.display = "flex"

  setTimeout(async () => {

    spinnerNps.style.display = "none"

    const getDataResearches = await getNpsDataChart(dateInterval, storeNumber)
    await chartNPSIndicator([getDataResearches[0], getDataResearches[1], getDataResearches[2]])

  }, 1000)

  // DEPARTAMENT CHART

  const getDataTopicsByDepartments = await getDepartmentDataChart(dateInterval, storeNumber)

  if (getDataTopicsByDepartments != 'no-data') {

    const spinnerDepartment = document.getElementById('spinner-overlay-department')

    spinnerDepartment.style.display = "flex"

    setTimeout(async () => {

      spinnerDepartment.style.display = "none"

      await updateSelects(getDataTopicsByDepartments);
      await updateChartDepartments(getDataTopicsByDepartments);

      avaliacaoSelect.addEventListener('change', async () => {


        spinnerDepartment.style.display = "flex"


        setTimeout(async () => {

          await updateChartDepartments(getDataTopicsByDepartments);
          spinnerDepartment.style.display = "none"


        }, 500)


      });

      departamentoSelect.addEventListener('change', async () => {

        spinnerDepartment.style.display = "flex"

        setTimeout(async () => {

          await updateChartDepartments(getDataTopicsByDepartments);
          spinnerDepartment.style.display = "none"

        }, 500);
      });

    }, 1000)


  } else {
    const divDepartmentChart = document.getElementById('card-department-chart')
    divDepartmentChart.style.display = 'none'
  }

  // GRÁFICO BINÁRIO DINÂMICO

  generateDynamicCharts(dateInterval, storeNumber)

}

async function reloadStaticCharts(storeNumber) {

  const spinnerMonth = document.getElementById('spinner-overlay-month')

  spinnerMonth.style.display = "flex"

  setTimeout(async () => {

    spinnerMonth.style.display = "none"

    const researchForAMonth = await getAmountMonthResearchesDataChart(storeNumber)
    await chartBarsVolumeResearchMonth(researchForAMonth)

  }, 1000)

  const spinnerDays = document.getElementById('spinner-overlay-days')

  spinnerDays.style.display = "flex"

  setTimeout(async () => {

    spinnerDays.style.display = "none"

    const researchForADay = await getAmountDaysResearchesDataChart(storeNumber)
    await chartLinesVolumResearch(researchForADay.newDate, researchForADay.oldDate)

  }, 1000)

}


// SELECT DE STORE

const backOrNextButton = document.querySelectorAll(".backOrNext")
const backButton = document.getElementById("backButton")
const nextButton = document.getElementById("nextButton")
let selectedIndex = selectStore.selectedIndex


function choiceSelectStoreButtons(wichButtonClicked) {

  const selectedIndex = selectStore.selectedIndex
  const optionsCount = selectStore.options.length

  if (wichButtonClicked === 'nextButton') {

    if (selectedIndex < optionsCount - 1) {

      selectStore.selectedIndex = selectedIndex + 1
      changeSelectButtonState(selectStore.selectedIndex)
      //console.log(selectStore.options[selectStore.selectedIndex].text)
      //console.log('ID do item selecionado:', selectStore.options[selectStore.selectedIndex].value)

    }

  } else {

    if (selectedIndex > 0) {

      selectStore.selectedIndex = selectedIndex - 1
      changeSelectButtonState(selectStore.selectedIndex)
      //console.log(selectStore.options[selectStore.selectedIndex].text)
      //console.log('ID do item selecionado:', selectStore.options[selectStore.selectedIndex].value)

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

backOrNextButton.forEach(button => {

  button.addEventListener('click', (event) => {

    choiceSelectStoreButtons(button.id)
    clickFilterButton()


  })

})

selectStore.addEventListener('change', async (event) => {

  changeSelectButtonState(selectStore.selectedIndex)
  clickFilterButton()

})

const filterButton = document.getElementById("filterButton");
function clickFilterButton() {
  filterButton.click();

}

function createOptionsSelect(data) {

  const storeSelect = document.getElementById("storeSelect")

  const option = document.createElement("option")
  option.value = 0;
  option.textContent = 'CONSOLIDADO - TODAS AS LOJAS';
  storeSelect.appendChild(option)

  if (data != 'no-store') {

    data.forEach(item => {

      if (item.active === 1) {

        const option = document.createElement("option")
        option.value = item.store_number
        option.text = 'LJ ' + item.store_number + " - " + item.name + " - " + item.address
        storeSelect.appendChild(option)

      }
    })

  }

}


// NOVO DATE PICKER

document.addEventListener("DOMContentLoaded", function () {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const todayButton = document.getElementById("todayButton");
  const last30DaysButton = document.getElementById("last30Days");
  const last14DaysButton = document.getElementById("last14Days");
  const last7DaysButton = document.getElementById("last7Days");


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
    //const spinnerAnswerTable = document.getElementById('spinner-overlay-answerTable')


    if (startDate && endDate) {

      const dateIntervalForRequest = [formatDateToUS(startDate.toLocaleDateString()), formatDateToUS(endDate.toLocaleDateString())]

      let selectedStoreNumber = selectStore.options[selectStore.selectedIndex].value

      await reloadStaticCharts(selectedStoreNumber)
      await reloadAllCharts(dateIntervalForRequest, selectedStoreNumber)

    }

  })

  function markButtonActive(button) {
    [todayButton, last30DaysButton, last14DaysButton, last7DaysButton].forEach(function (btn) {
      btn.classList.remove("active")
    });
    button.classList.add("active")
  }

})

function getRateTextAndIcon(tree) {
  if (tree === 1) {
    return 'Positiva <i class="bi bi-hand-thumbs-up text-success"></i>';
  } else {
    return 'Negativa <i class="bi bi-hand-thumbs-down text-danger"></i>';
  }
}

let chartsPizza = [];


function createPizzaCharts(data) {


  const colors = [
    'rgb(187, 187, 187)',
    'rgba(252, 41, 18, 0.7)',
    'rgba(76, 175, 80, 0.7)',
  ];

  const containerAllCharts = document.getElementById('container-all-charts');

  const chartDivs = containerAllCharts.querySelectorAll('.pizzaCharts');
  chartDivs.forEach(div => {
    div.remove();
  });
  chartsPizza.forEach(chart => {
    chart.destroy();
  });
  chartsPizza = [];

  if (data.message === 'no-results') {
    return;
  }

  data.forEach((item, index) => {
    const question = item.pergunta;
    const options = Object.keys(item).slice(2);

    const lastTwoValues = options.slice(-2).map(option => item[option]);

    if (lastTwoValues.every(value => value === '0')) {
      return;
    }

    const total = options.reduce((acc, key) => Number(acc) + Number(item[key]), 0);

    const dataPoints = options.map((option, i) => ({
      label: `${option} - ${((item[option] / total) * 100).toFixed(2)}%`,
      data: item[option],
      backgroundColor: colors[(i + index) % colors.length],
    }));

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.classList.add('pizzaCharts');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'd-flex', 'flex-wrap', 'align-items-center', 'justify-content-center');

    const arvoreDiv = document.createElement('div');
    arvoreDiv.classList.add('text-center', 'text-muted', 'm-2');
    arvoreDiv.innerHTML = `Os clientes que avaliaram de forma ${getRateTextAndIcon(item.arvore)} responderam: `;
    cardBodyDiv.appendChild(arvoreDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('text-center', 'text-muted', 'fw-bolder', 'm-5');
    titleDiv.style.fontSize = '24px';
    titleDiv.innerHTML = `<div class="mx-auto">${question}</div>`;
    cardBodyDiv.appendChild(titleDiv);

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-lg-8');

    const canvas = document.createElement('canvas');
    canvas.id = `chart-canvas-${index}`;
    colDiv.appendChild(canvas);

    const labelInfo = document.createElement('div');
    labelInfo.classList.add('text-center', 'text-muted', 'align-items-center');

    options.forEach(option => {
      const customerMessage = Number(item[option]) > 1 ? 'clientes responderam' : 'cliente respondeu';
      labelInfo.innerHTML += `${Number(item[option])} ${customerMessage} <strong>${option}</strong> - (${((Number(item[option]) / total) * 100).toFixed(2)}%)<br>`;
    });

    labelInfo.innerHTML += `<strong>Total de Respostas:</strong> ${total}`;

    cardBodyDiv.appendChild(colDiv);
    cardBodyDiv.appendChild(labelInfo);

    cardDiv.appendChild(cardBodyDiv);

    containerAllCharts.appendChild(cardDiv);

    const ctx = canvas.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: dataPoints.map(data => data.label),
        datasets: [{
          data: dataPoints.map(data => data.data),
          backgroundColor: dataPoints.map(data => data.backgroundColor),
        }]
      },
      options: {
        plugins: {
          title: {
            display: false,
            text: question,
            fontSize: 16,
          },
        },
        legend: {
          display: false,
        },
      }
    });

    chartsPizza.push(chartInstance);
  });
}

async function questionsRequest() {

  const response = await fetch(
    configEnv.app_mode === 'production'
      ? configEnv.web_address + '/company-questions'
      : configEnv.local_address + '/company-questions',
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();

  // if (data.message != 'no-questions') {

  //   const filteredData = data.filter(item => item.status === 1);
  //   return filteredData

  // }

  return data

}

async function generateDynamicCharts(date, storeNumber) {

  const questions = await questionsRequest();

  if (questions.message != 'no-questions') {

    const hasBinaryQuestion = questions.some(question => {
      return question.type_question === 'binary';
    });

    if (hasBinaryQuestion) {

      const dataCharts = await getBinaryDataCharts(date, storeNumber)

      console.log('data enviado pro chart pizza', dataCharts);

      createPizzaCharts(dataCharts)


    }

  }

  if (questions.message != 'no-questions') {

    const hasFlexQuestion = questions.some(question => {
      return question.type_question === 'flex';
    });

    if (hasFlexQuestion) {
      
      const dataCharts = await getFlexDataCharts(date, storeNumber)

      await makeChartForFlexQuestions(dataCharts)


    }

  }

}

async function getBinaryDataCharts(dateInterval, storeNumber) {

  if (storeNumber && storeNumber != 0) {

    const response = await fetch(
      configEnv.app_mode === 'production'
        ? configEnv.web_address + `/questions/binary/${dateInterval[0]}/${dateInterval[1]}/${storeNumber}`
        : configEnv.local_address + `/questions/binary/${dateInterval[0]}/${dateInterval[1]}/${storeNumber}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + tokenCustomer,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    return data

  } else {

    const response = await fetch(
      configEnv.app_mode === 'production'
        ? configEnv.web_address + `/questions/binary/${dateInterval[0]}/${dateInterval[1]}`
        : configEnv.local_address + `/questions/binary/${dateInterval[0]}/${dateInterval[1]}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + tokenCustomer,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    return data;

  }

}

async function getFlexDataCharts(dateInterval, storeNumber) {

  if (storeNumber && storeNumber != 0) {

    const response = await fetch(
      configEnv.app_mode === 'production'
        ? configEnv.web_address + `/questions/flex/${dateInterval[0]}/${dateInterval[1]}/${storeNumber}`
        : configEnv.local_address + `/questions/flex/${dateInterval[0]}/${dateInterval[1]}/${storeNumber}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + tokenCustomer,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log(data)
    return data

  } else {

    const response = await fetch(
      configEnv.app_mode === 'production'
        ? configEnv.web_address + `/questions/flex/${dateInterval[0]}/${dateInterval[1]}`
        : configEnv.local_address + `/questions/flex/${dateInterval[0]}/${dateInterval[1]}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + tokenCustomer,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log(data)
    return data;

  }

}



const avaliacaoSelect = document.getElementById('avaliacao')
const departamentoSelect = document.getElementById('departamento')

// Verifica se os elementos foram encontrados antes de prosseguir


// Função para organizar os dados da maior para a menor
function organizeData(data) {
  return Object.entries(data).sort((a, b) => {
    const sumA = Object.values(a[1]).reduce((acc, cur) => acc + cur, 0);
    const sumB = Object.values(b[1]).reduce((acc, cur) => acc + cur, 0);
    return sumB - sumA;
  });
}


async function updateSelects(data) {
  avaliacaoSelect.innerHTML = '';
  departamentoSelect.innerHTML = '';

  Object.keys(data).forEach(avaliacao => {
    const optionAvaliacao = document.createElement('option');
    optionAvaliacao.value = avaliacao;
    optionAvaliacao.textContent = avaliacao;
    avaliacaoSelect.appendChild(optionAvaliacao);
  });

  avaliacaoSelect.selectedIndex = 0;
  const primeiroAvaliacao = avaliacaoSelect.value;

  Object.keys(data[primeiroAvaliacao]).forEach(departamento => {
    const optionDepartamento = document.createElement('option');
    optionDepartamento.value = departamento;
    optionDepartamento.textContent = departamento;
    departamentoSelect.appendChild(optionDepartamento);
  });
}

async function updateChartDepartments(data) {
  const avaliacao = avaliacaoSelect.value;
  const departamento = departamentoSelect.value;
  const dados = data[avaliacao][departamento];

  if (Object.keys(dados).length === 0) {
    document.getElementById('body-department-chart').innerHTML = '<div class="text-center text-muted" style="margin-top: 50%;">Não há dado a ser mostrado para o filtro selecionado.</div>';
    return;
  }

  const sortedData = organizeData(dados);
  const categorias = sortedData.map(([categoria]) => categoria);
  const valores = sortedData.map(([_, valor]) => valor);

  let corBarras;
  if (avaliacao === 'POSITIVA') {
    corBarras = 'rgba(54, 235, 83, 0.6)';
  } else if (avaliacao === 'NEGATIVA') {
    corBarras = 'rgba(235, 54, 98, 0.6)';
  }

  const options = {
    chart: {
      type: 'bar',
      borderRadius: 5,
      style: {
        fontFamily: 'Arial, sans-serif',
      },
    },
    accessibility: {
      enabled: false
    },
    title: {
      text: '',
      style: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: '24px',
      },
    },
    xAxis: {
      categories: categorias,
      labels: {
        style: {
          color: '#333',
          fontSize: '10px',
          fontFamily: 'Arial, sans-serif', // Defina aqui a fonte desejada
        },
      },
    },
    yAxis: {
      visible: false, // Desabilita o eixo y
    },
    series: [{
      name: 'Menções',
      data: valores,
      color: corBarras, // Cor das barras baseada na avaliação selecionada
    }],
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderRadius: 4,
        borderWidth: 0,
      },
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  // Atualizar o gráfico
  Highcharts.chart('body-department-chart', options);
}




// const dataTeste = [
//   {
//     "question_id": 55,
//     "pergunta": "Nossos colaboradores costumam ser solícitos quando precisa de ajuda em nossa loja?",
//     "arvore": 1,
//     "answer": { "SEMPRE": 3, "QUASE NUNCA": 2, "NUNCA": 3 }
//   },
//   {
//     "question_id": 56,
//     "pergunta": "Em uma escala de 1 a 5 (1 para péssimo e 5 para ótimo) como você avalia a estrutura de nossas lojas?",
//     "arvore": 0,
//     "answer": { "1": 3, "2": 5, "3": 1, "4": 1, "5": 6 }
//   },
//   {
//     "question_id": 57,
//     "pergunta": "Por qual meio de comunicação você costuma receber nossas ofertas?",
//     "arvore": 1,
//     "answer": { "WHATSAPP": 2, "E-MAIL": 6, "IMPRESSO": 2, "INSTAGRAM": 15 }
//   },
// ]

let chartsFlexPie = [];

async function makeChartForFlexQuestions(data) {

  const cores = [
    'rgba(76, 175, 80, 0.7)',
    'rgba(252, 41, 18, 0.7)',
    'rgba(240, 87, 66, 1)',
    'rgba(54, 235, 83, 0.6)',
    'rgba(235, 54, 98, 0.6)',
    'rgba(231, 242, 249, 1)',
    'rgb(187, 187, 187)',
    'rgba(249, 168, 37, 0.8)', 
    'rgba(203, 117, 112, 0.65)',
    'rgba(146, 146, 146, 1)'
  ]

  const containerAllCharts = document.getElementById('container-all-charts');

  const chartDivs = containerAllCharts.querySelectorAll('.chart-flex');
  chartDivs.forEach(div => {
    div.remove();
  });
  chartsFlexPie.forEach(chart => {
    chart.destroy();
  });
  chartsFlexPie = [];

  if (data.message === 'no-results') {
    return;
  }

  data.forEach(function (item) {
    var chartData = [];
    var total = 0; 
  
    Object.values(item.answer).forEach(function (value) {
      total += value;
    });

    const coresCopy = [...cores];
  
    Object.keys(item.answer).forEach(function (key, index) {
      var percentage = ((item.answer[key] / total) * 100).toFixed(2); 
      var label = `${key} - ${percentage}%`; // Alteração do label
      var randomIndex = Math.floor(Math.random() * coresCopy.length); 
      var backgroundColor = coresCopy[randomIndex];
      chartData.push({ name: label, y: item.answer[key], color: backgroundColor });
      coresCopy.splice(randomIndex, 1);
    });

    var containerId = 'container-chart-' + item.question_id;
    var container = document.createElement('div');
    container.classList.add('chart-flex')
    container.setAttribute('id', containerId);
    containerAllCharts.appendChild(container);

    const divsChartFlex = document.querySelectorAll('.chart-flex');
    console.log(divsChartFlex)

    Highcharts.chart(containerId, {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        },
        events: {
          load: function () {
            var renderer = this.renderer;
            renderer.text('Total de Respostas: ' + total, 10, this.chartHeight - 20).attr({
              zIndex: 6
            }).add();
          }
        }
      },
      title: {
        text: `<div class="text-center text-muted m-5"> Os clientes que avaliaram de forma ${getRateTextAndIcon(item.arvore)} responderam: </div>`,
        style: {
          color: '#666', 
          fontSize: '14px',
          fontWeight: 'normal' 
        },
        useHTML: true
      },
      subtitle: {
        text: `<div class="mx-auto"><h5 class="text-center text-muted fw-bolder m-2" style="font-size: 18px">${item.pergunta}</h5></div>`,
        useHTML: true
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'Respostas',
        data: chartData
      }],
      credits: {
        enabled: false 
      },
      accessibility: {
        enabled: false,
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      }
    });
  });
}



