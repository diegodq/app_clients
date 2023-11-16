module.exports = {
    async homeDash (request, response)
    {
      return response.render('dashboard/dashboard', { title: 'HOME | AUTOMATIZA VAREJO'});
    },
  
    async passwordReset(request, response)
    {
      return response.render('auth/password-reset', { title: 'RECUPERAÇÃO DE SENHA | AUTOMATIZA VAREJO'});
    },
    
    async signIn(request, response)
    {
      return response.render('auth/sign-in', { title: 'ENTRAR | AUTOMATIZA VAREJO'});
    },
  
    async signUpCompany(request, response)
    {
      return response.render('auth/sign-up-company', { title: 'CADASTRO EMPRESA | AUTOMATIZA VAREJO'});
    },
    
    async signUpCustomer(request, response)
    {
      return response.render('auth/sign-up-customer', { title: 'CADASTRO CLIENTE | AUTOMATIZA VAREJO'});
    },
  }