module.exports = {
  async invitation(request, response)
  {
    return response.render('notifications/invitation');
  },

  async passwordChanged(request, response)
  {
    return response.render('notifications/password-changed');
  },
  
  async passwordReset(request, response)
  {
    return response.render('notifications/password-reset');
  },

  async verifyEmail(request, response)
  {
    return response.render('notifications/verify-email');
  },
}