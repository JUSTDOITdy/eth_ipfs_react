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
   console.log(result);
});
file_name,
size,
imgHash,
uploader,
upload_time,status,
uploader_name,
block_hash,
transaction_hash
connection.end();
connection.end( (err) => {
    if(err) {
        throw err;
        return;
    }

    console.log('connection close');
});
<Content
  className="site-layout-background"
  style={{
    padding: 24,
    margin: 0,
    minHeight: 280,
  }}
>
<input ref="blockLabel" style={{width: 500,height: 20,borderWidth: 2,marginRight: 50}}/>
      <button onClick={() => {
         let str = this.refs.blockLabel.value;
        contract.methods.setStr(str).send({ from: this.state.accounts[0] }).then((result) => {
          console.log("set函数的result(一个包含交易信息的对象):"+result);
          console.log(result); //这个result就包含所有需要的数据了
          console.log("result.blockHash:        "+result.blockHash);
          console.log("result.blockNumber:      "+result.blockNumber);
          console.log("result.from:             "+result.from);
          console.log("result.transactionHash:  "+result.transactionHash);
          console.log("result.transactionIndex: "+result.transactionIndex);
          this.setState({blockHash: result.blockHash,blockNumber:result.blockNumber ,transactionHash:result.transactionHash});

          //web3.eth.getTransactionReceipt(result.transactionHash).then(console.log);
         //也取出说不需要
          //根据块hash
          // contract.methods.get().call().then((results) => {
          //   web3.eth.getStorageAt(contractAddress, 0).then(res => {
          //     console.log(res+"   把getStorageAt的内容转一下："+web3.utils.hexToUtf8(res));
          //   });
          //   web3.eth.getCode(contractAddress).then(resa => {
          //     console.log(resa+"   getCode得到的是deployedBytecode");
          //   });
          //
          //   web3.eth.getBlock(this.state.blockNumber).then(resq => {
          //     console.log("getBlock : ");
          //     console.log(resq);
          //   });
          //   web3.eth.getTransaction(this.state.transactionHash).then(resw =>{
          //     console.log("getTransaction : ");
          //     console.log(resw);
          //   });
          //   console.log(results);
          //   console.log("get函数的results(就是bytes的16进制):  "+results);
          //    let res = web3.utils.hexToUtf8(results);
          //    console.log("把bytes转变为utfs字符串:  "+res);
          //   this.setState({storageValue: res});

            获得当前块号
            console.log("获取当前块号");
            web3.eth.getBlockNumber().then(result => {
              console.log("result: "+result);
              web3.eth.getBlock(result).then(console.log);
              web3.eth.getBlock(result,true).then(console.log);
              //web3.eth.getTransaction(transactionHash).then(console.log);
            });
            获得当前块信息
            console.log("获取块信息，默认");
            web3.eth.getBlock(blockNumber).then(console.log);
            console.log("获取块信息，true");
            web3.eth.getBlock(blockNumber,true).then(console.log);
            //获得指定交易的收据对象
            // console.log("获取指定hash值的交易对象");
            // web3.eth.getTransaction(transactionHash).then(console.log);
            // console.log("获取交易收据对象");
            // var receipt = web3.eth.getTransactionReceipt(交易hash).then(console.log);
          //})
        });
      }}>写入区块链</button>

      <button onClick={() => {
        console.log("获取+++++++++++++++++++++++++++++");
        contract.methods.getStr().call().then((results) => {
          web3.eth.getStorageAt(contractAddress, 0).then(res => {
            console.log(res+"   把getStorageAt的内容转一下："+web3.utils.hexToUtf8(res));
          });
          web3.eth.getCode(contractAddress).then(resa => {
            console.log(resa+"   getCode得到的是deployedBytecode");
          });

          web3.eth.getBlock(this.state.blockNumber).then(resq => {
            console.log("getBlock : ");
            console.log(resq);
          });
          web3.eth.getTransaction(this.state.transactionHash).then(resw =>{
            console.log("getTransaction : ");
            console.log(resw);
            console.log("getTransaction里面的input: "+resw.input);
          });
          console.log(results);
          //console.log("get函数的results(就是bytes的16进制):  "+results);
           //let res = web3.utils.hexToUtf8(results);
           //console.log("把bytes转变为utfs字符串:  "+res);
          this.setState({storageValue: results});
        });

      }}>获取</button><br/><br/>

    <input ref="blockLabela" style={{width: 500,height: 20,borderWidth: 2,marginRight: 50}}/>
    <button onClick={() => {
      let str = this.refs.blockLabela.value;
      contract.methods.setstrArray(str).send({ from: this.state.accounts[0] }).then((result) => {
        console.log(result);
        contract.methods.getArrayCount().call().then((results) => {
          this.setState({Length: results});
        });
      });
    }}>写入区块链的数组</button><br/>
    <div>区块链中数组长度 :<b>{this.state.Length}</b></div><br/><br/>
</Content>
