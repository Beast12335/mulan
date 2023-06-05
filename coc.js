const {Client} = require('clashofclans.js');
const client = new Client();
const cc = await client.login({email: process.env.mail, password: process.env.password});
module.exports = cc
