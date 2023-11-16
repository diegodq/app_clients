module.exports = {

  async newPassword(request, response)
  {
    return response.render('auth/new-password', { title: 'ALTERAR SENHA | AUTOMATIZA VAREJO'})
  },

  async passwordReset(request, response)
  {
    return response.render('auth/password-reset', { title: 'RECUPERAÇÃO DE SENHA | AUTOMATIZA VAREJO'});
  },
  
  async signIn(request, response)
  {
    return response.render('auth/sign-in', { title: ' ENTRAR | AUTOMATIZA VAREJO'});
  },

  async signUpCompany(request, response)
  {
    return response.render('auth/sign-up-company', { title: 'CADASTRO EMPRESA | AUTOMATIZA VAREJO'});
  },
  
  async signUpCustomer(request, response)
  {
    return response.render('auth/sign-up-customer', { title: 'CADASTRO CLIENTE | AUTOMATIZA VAREJO'});
  },

  async activeCustomer(request, response)
  {
    return response.render('auth/active-customer', { title: 'ATIVAÇÃO CLIENTE | AUTOMATIZA VAREJO'});
  },

}