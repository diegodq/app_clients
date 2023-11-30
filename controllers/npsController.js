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
    async stores (request, response)
    {
      return response.render('pesquisaNps/registers/stores', { title: 'LOJAS | AUTOMATIZA VAREJO'});
    },
    async managerSurvey (request, response)
    {
      return response.render('pesquisaNps/manager-survey', { title: 'GESTÃO DE PESQUISA | AUTOMATIZA VAREJO'})
    },
    async toolsSurvey (request, response)
    {
      return response.render('pesquisaNps/registers/tools-survey', { title: 'FERRAMENTAS DE PESQUISA | AUTOMATIZA VAREJO'})
    },
    async answers (request, response)
    {
      return response.render('pesquisaNps/answers', { title: 'PESQUISAS RESPONDIDAS | AUTOMATIZA VAREJO'})
    }
  }