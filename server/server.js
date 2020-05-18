const express = require('express');
const app = express();
const mysql = require('mysql');
const router = require("./router")
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

/*
app.use("/",router);
app.listen(4000,function(){
  console.log("server:port:4000");
})
*/
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Orign', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'test'
});
connection.connect( (err) => {
    if(err) {
        console.err('err connecting:', err.stack);
        return;
    }
    console.log('connection as id:', connection.threadId);
});
app.get('/select', jsonParser, (req, res) => {
    let result={results:null,
            filed:null
      };
    let data = req.body;
    var sql = 'SELECT * FROM file_table';
    connection.query(sql, (err, results,fields) => {
        if(err)
            throw err;
        result.results = results;
        result.filed = fields;
        res.send(result);
    });
});
app.post('/insert', (req, res) => {
    let data = req.body;
    console.log(req.body);
    console.log(data);
    let insertdata = [
      data.file_name,
      data.file_hash,
      data.size,
      data.uploader,
      Date.now(),
      data.status,
      data.uploader_name,
      data.block_hash,
      data.transaction_hash
    ]
    console.log(insertdata);
    var sql = 'INSERT INTO file_table(file_name,) VALUES(?,?,?,?,?,?,?,?,?)';
    connection.query(sql, insertdata ,(err, result) => {
        if(err) throw err;
        res.send(result);
    });
});
app.post('/test',(req, res) => {
  console.log(req.body);
})
let server = app.listen(4000, function(){
    const port = server.address().port;
    console.log('server starts....');
    console.log('*===============*');
    console.log('server is running at port', port);
})
