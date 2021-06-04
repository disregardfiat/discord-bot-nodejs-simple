require('dotenv').config();
const ENV = process.env;

exports.token = '' || ENV.token
exports.coin = ENV.coin || 'dlux'
exports.coinapi = ENV.coinapi || 'https://token.dlux.io'
exports.coin_logo = ENV.coinlogo || 'https://cdn.discordapp.com/attachments/534553113433210902/850461330405589032/dlux-hive-logo.png'