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

    const option = document.createElement("option")
    option.value = 0
    option.textContent = `${detailsCompany.corporate_name}`
    selectStore.appendChild(option)

    reloadStaticCharts()
    const dateIntervalInitial = await getDatesForLast7Days()

    reloadAllCharts(dateIntervalInitial)
  
  }
  
});

async function getDetailsCompany () {

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

      if(data.message != 'no-store') {
        createOptionsSelect(data.message)
        
      }

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
        name: 'Menções', // Nome da série
        data: values.map(value => -value), // Inverter os valores para o efeito espelhado
        color: 'rgba(235, 54, 98, 0.6)', // Cor das barras
        showInLegend: false, // Não mostrar na legenda
      }],
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
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

async function getDepartmentDataChart(date, tree, storeNumber) {

  
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
  
    return data.employees



  } else {

    const response = await fetch(`${configEnv.app_mode == 'production' ? configEnv.web_address : configEnv.local_address}/dashboard/employee/${date[0]}/${date[1]}/${tree}`, {
      headers: {
        'Authorization': 'Bearer ' + tokenCustomer,
        'Content-Type': 'application/json'
      },
    })
  
    const data = await response.json()
  
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

  // DEPARTAMENT CHARTS

  const cardDepartment = document.getElementById('card-department-chart')
  const spinnerDepartment = document.getElementById('spinner-overlay-department')

  spinnerDepartment.style.display = "flex"

  setTimeout(async () => {

    spinnerDepartment.style.display = "none"

    const getDataPositiveDepartaments = await getDepartmentDataChart(dateInterval, 1, storeNumber)

    const getDataNegativeDepartaments = await getDepartmentDataChart(dateInterval, 0, storeNumber)

    await chartBarsPositiveHall(getDataPositiveDepartaments, 'departmentBarChartPositive')
    await chartBarsNegativeHall(getDataNegativeDepartaments, 'departmentBarChartNegative')

    // console.log('Departamentos Positivos:', getDataPositiveDepartaments)
    // console.log('Departamentos Negativos:', getDataNegativeDepartaments)

  }, 1000)

  // TOPIC CHARTS

  const spinnerTopic = document.getElementById('spinner-overlay-topic')

  spinnerTopic.style.display = "flex"

  setTimeout(async () => {

    spinnerTopic.style.display = "none"

    const getDataPositiveTopics = await getTopicDataChart(dateInterval, 1, storeNumber)

    const getDataNegativeTopics = await getTopicDataChart(dateInterval, 0, storeNumber)

    await chartBarsPositiveHall(getDataPositiveTopics, 'topicBarChartPositive')
    await chartBarsNegativeHall(getDataNegativeTopics, 'topicBarChartNegative')

  }, 1000)

  // EMPLOYEE CHARTS

  const spinnerEmployee = document.getElementById('spinner-overlay-employee')

  spinnerEmployee.style.display = "flex"

  setTimeout(async () => {

    spinnerEmployee.style.display = "none"

    const getDataPositiveEmployee = await getEmployeeDataChart(dateInterval, 1, storeNumber)
    const getDataNegativeEmployee = await getEmployeeDataChart(dateInterval, 0, storeNumber)

    await chartBarsPositiveHall(getDataPositiveEmployee, 'employeeBarChartPositive')
    await chartBarsNegativeHall(getDataNegativeEmployee, 'employeeBarChartNegative')

    // console.log('Employee Positivos:', getDataPositiveEmployee)
    // console.log('Employee Negativos:', getDataNegativeEmployee)

  }, 1000)

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


const tempData = [
  { id: 1, number: 1, name: 'CAIQUE', address: 'EQNO 5/7 CEILANDIA' },
  { id: 2, number: 4, name: 'CAIQUE', address: 'QN208 SAMAMBAIA NORTE' },
  { id: 3, number: 5, name: 'CAIQUE', address: 'RF14 RIACHO FUNDO' },
  { id: 4, number: 6, name: 'SEMPRE BEM', address: 'CL20 SOBRADINHO' },
  { id: 5, number: 7, name: 'SEMPRE BEM 2', address: 'QS111 SAMAMBAIA SUL' },
  { id: 6, number: 8, name: 'LOGISTICA SUL', address: 'QS610 SAMAMBAIA NORTE' },
]

function createOptionsSelect (data) {
  
  const storeSelect = document.getElementById("storeSelect")

  const option = document.createElement("option")
  option.value = 0;
  option.textContent = 'CONSOLIDADO - TODAS AS LOJAS'; 
  storeSelect.appendChild(option)


  data.forEach(item => {

    if (item.active === 1) {
      
      const option = document.createElement("option")
      option.value = item.store_number
      option.text = 'LJ '+item.store_number + " - " + item.name + " - " + item.address
      storeSelect.appendChild(option)

    }
  })

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

  //last7DaysButton.click()

})