const mysql = require('mysql2');
const dotenv = require('dotenv');

// Read the contents of the .env file
const envFile = fs.readFileSync('.env');

// Parse the contents into an object
const envConfig = dotenv.parse(envFile);

// Load the environment variables
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

// create the connection to database
module.exports = {
  const connection = mysql.createConnection({
    host: process.env['host'],
    user: process.env['user'],
    database: 'mulan'
});
};
