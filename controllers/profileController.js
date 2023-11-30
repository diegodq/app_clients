module.exports = {
  async billing(request, response)
  {
    return response.render('profile/billing', { title: 'PAGAMENTOS | AUTOMATIZA VAREJO'});
  },

  async choiceProduct(request, response)
  {
    return response.render('welcome/choice-product', { title: 'BEM-VINDO | AUTOMATIZA VAREJO'});
  },
  
  async editProfileCustomer(request, response)
  {
    return response.render('profile/edit-profile-customer', { title: 'CONFIGURAÇÕES DE CONTA | AUTOMATIZA VAREJO'});
  },
  
  async overview(request, response)
  {
    return response.render('profile/overview', { title: 'PERFIL | AUTOMATIZA VAREJO'});
  },
  
  async settings(request, response)
  {
    return response.render('profile/settings');
  },
}