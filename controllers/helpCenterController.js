module.exports = {
	async helpCenter(request, response)
	{
		return response.render('helpCenter/help_center', {title: 'Central de Ajuda'});
	}
}
