const {Client} = require('clashofclans.js');
const dotenv = require('dotenv');
const fs = require ('fs');
// Read the contents of the .env file
const envFile = fs.readFileSync('.env');

// Parse the contents into an object
const envConfig = dotenv.parse(envFile);

// Load the environment variables
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}
const client = new Client();
async function cc{
  const cc = await client.login({email: process.env.mail, password: process.env.password});
}
module.exports = cc
