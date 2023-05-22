const mysql = require('mysql2');

// create the connection to database
module.exports:{
  const connection = mysql.createConnection({
    host: process.env['host'],
    user: 'root',
    database: 'mulan'
});
};
