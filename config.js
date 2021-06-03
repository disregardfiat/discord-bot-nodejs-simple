require('dotenv').config();
const ENV = process.env;

exports.token = '' || ENV.token
exports.coin = 'dlux' || ENV.coin
exports.coinapi = 'https://token.dlux.io' || ENV.coinapi