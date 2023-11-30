const configEnv = {
	app_mode: 'development',
	local_address: 'http://localhost:3007',
	web_address: 'https://api.automatizavarejo.com.br',
	geoLocator: 'https://api.ipgeolocation.io/ipgeo?apiKey=22d3753ff645418e9bf41d38dbf793e5',
}

// const configEnv = {
// 	app_mode: 'development',
// 	local_address: 'http://192.168.0.10:3007',
// 	web_address: 'https://api.automatizavarejo.com.br',
// 	geoLocator: 'https://api.ipgeolocation.io/ipgeo?apiKey=22d3753ff645418e9bf41d38dbf793e5'
// }

const npsConfigEnv = {
	app_mode: configEnv.app_mode,
	local_address: `${configEnv.local_address.split(':')[1]}:3008`,
	web_address: 'https://pesquisa.automatizavarejo.com.br'
}
