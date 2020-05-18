const mysql   = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'test'
});

connection.connect();
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
   if (error) throw error;
    console.log('The solution is: ', results[0].solution);
 });
 var  sql = 'SELECT * FROM file_table';

connection.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      return;
    }

   console.log('--------------------------SELECT----------------------------');
   console.log(result);
   console.log('------------------------------------------------------------\n\n');
});

connection.end();
