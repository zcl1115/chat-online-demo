var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'test_db',
  timezone : "08:00"
});

module.exports = connection;
