module.exports = {
    async departments (request, response)
    {
      return response.render('pesquisaNps/registers/departments', { title: 'DEPARTAMENTOS | AUTOMATIZA VAREJO'});
    },
    async topics (request, response)
    {
      return response.render('pesquisaNps/registers/topics', { title: 'TÓPICOS AVALIÁVEIS | AUTOMATIZA VAREJO'});
    },
    async personalizedQuestions (request, response)
    {
      return response.render('pesquisaNps/registers/questions', { title: 'PERGUNTAS | AUTOMATIZA VAREJO'})
    },
    async managerSurvey (request, response)
    {
      return response.render('pesquisaNps/manager-survey', { title: 'GESTÃO DE PESQUISA | AUTOMATIZA VAREJO'})
    },
  }