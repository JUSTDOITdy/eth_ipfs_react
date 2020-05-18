import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import axios from "axios";
import qs from "querystring";
import "./App.css";
import { Layout, Menu, Breadcrumb,Button,Form,Input,Table, Tag,Row,Col,Card  } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});

const columns = [
  {
    title: '文件名',
    dataIndex: 'file_name',
    key: 'file_name',
    render: text => <a>{text}</a>,
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: '上传者',
    dataIndex: 'uploader',
    key: 'uploader',
  },
  {
    title: '上传时间',
    dataIndex: 'upload_time',
    key: 'upload_time',
  },
  {
    title: '权限',
    key: 'status',
    dataIndex: 'status',
    // render: status => (
    //   <span>
    //     {status => {
    //       let color = status.length > 5 ? 'geekblue' : 'green';
    //       if (status === '未公开') {
    //         color = 'volcano';
    //       }
    //       return (
    //         <Tag color={color} key={status}>
    //           {status}
    //         </Tag>
    //       );
    //     }}
    //   </span>
    // ),
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>请求获取 {record.name}</a>
      </span>
    ),
  },
];

let saveImageOnIpfs = (reader) => {
  return new Promise(function(resolve, reject) {
    const buffer = Buffer.from(reader.result);
    ipfs.add(buffer).then((response) => {
      console.log("ipfs.add成功后返回的response:");
      console.log(response)
      resolve(response[0].hash);
    }).catch((err) => {
      console.error(err)
      reject(err);
    })
  })
}

class App extends Component {
  state = { storageValue: "0", valueToutf8: null , web3: null, accounts: null, balance:0,contract: null , contractAddress: null,
      blockHash:null , blockNumber:null , transactionHash: null ,Username:null,Length:0,
      filename:null, filesize:0,uploadtime:null,status:"公开",
      imgHash: null , isWriteSuccess:false,
      data:null
    };

    handleDownExcel= () => {
      const oa = document.createElement('a');
      oa.href = "http://localhost:8080/ipfs/" + this.state.imgHash;
      oa.setAttribute('target', '_blank');
      document.body.appendChild(oa);
      oa.click();
    };
    insertDB = (file_name,file_hash,size,uploader,upload_time,status,uploader_name,block_hash,transaction_hash) => {
      console.log("插入数据库");
      axios.post('/insert', {
            file_name: file_name,
            file_hash: file_hash,
            size:size,
            uploader:uploader,
            upload_time:upload_time,
            status:status,
            uploader_name:uploader_name,
            block_hash:block_hash,
            transaction_hash:transaction_hash
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    selectDB =()=>{
      let self = this;
      axios.get('/select').then(function (response) {
          console.log(response.data.results);
          self.setState({data:response.data.results});
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    getfilefromETH = ()=>{
      this.state.contract.methods.getFile(this.state.accounts[0]).call().then((result)=>{
        console.log(result);
      })
    }
    getInfo = ()=>{
      let self = this;
      this.state.web3.eth.getBlockNumber().then(result => {
        var num = Number(result);
        self.setState({blockNumber:num});
        this.state.web3.eth.getBlock(self.state.blockNumber).then(results =>{
          self.setState({blockHash:results.hash});
        });
        //web3.eth.getTransaction(transactionHash).then(console.log);
      });

    }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      //const contractAddress = "0xA628F94C831Da2cfE32d8BB7BA9922D3F9F45Ad5"
      // console.log(networkId)
      // console.log(deployedNetwork)
      // console.log(deployedNetwork.address)
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
        //contractAddress,
      );
      console.log(instance);
      console.log("智能合约地址"+deployedNetwork.address);
      console.log(accounts);
      console.log(web3.currentProvider);
      web3.eth.getAccounts().then(res => {
        console.log(res);
        console.log(res[0]);
      });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance , contractAddress: deployedNetwork.address}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { web3, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.setStr(web3.utils.toHex("~初始默认值~")).send({ from: this.state.accounts[0] });
    // await contract.methods.getName(this.state.accounts[0]).call().then((results) => {
    //   console.log(results);
    //   //let res = web3.utils.hexToUtf8(results);
    //   this.setState({Username:results});
    // });
    //web3.utils.toHex("rana")
    //web3.utils.hexToUtf8(hex)
    // Get the value from the contract to prove it worked.
    //let hex = await contract.methods.getFile(self.state.accounts[0]).call();
    //this.getfilefromETH();
    //const response = web3.utils.hexToUtf8(hex);
    // Update state with the result.
    // this.setState({ storageValue: hex });

    this.selectDB();
    this.getInfo();
    const self = this;

    setInterval(function() {
     web3.eth.getAccounts().then(res => {
        if(res[0] !== self.state.accounts[0]){
          alert("账户更改！\n"+"原账户："+self.state.accounts[0]+"\n现账户： "+res[0]);
          self.setState({accounts:res});
        }
      });
      web3.eth.getBalance(self.state.accounts[0]).then(res=>{
        let balance = web3.utils.fromWei(res);
        self.setState({balance:balance});
      })
    }, 1000);

  };

  render() {
    const { web3, contract, contractAddress } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <Layout>
               <Header className="header">
                 <div className="logo" />
                 <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                   <Menu.Item key="1">基于区块链+IPFS的数据共享系统</Menu.Item>
                 </Menu>
               </Header>
               <Layout>
                 <Sider width={200} className="site-layout-background">
                   <Menu
                     mode="inline"
                     defaultSelectedKeys={['1']}
                     defaultOpenKeys={['sub1']}
                     style={{ height: '100%', borderRight: 0 }}
                   >
                     <SubMenu key="sub1" icon={<UserOutlined />} title="区块链+IPFS">
                       <Menu.Item key="1">主页</Menu.Item>
                     </SubMenu>
                     <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                       <Menu.Item key="5">option5</Menu.Item>
                     </SubMenu>
                     <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                       <Menu.Item key="9">option9</Menu.Item>
                     </SubMenu>
                   </Menu>
                 </Sider>
                 <Layout style={{ padding: '0 24px 24px' }}>
                 <Row>
                      <Col span={10}>
                      <Card title="账户信息" bordered={true}>
                      <Form>
                       当前用户名: <b>{this.state.Username? this.state.Username:"未命名"}</b>
                         <input ref="nameLabel" style={{width: 130,marginLeft:40,marginRight: 0}}/>
                         <Button type="primary" onClick={() => {
                           let str = this.refs.nameLabel.value+'';
                           alert(str);
                           contract.methods.setName(this.state.accounts[0],str).send({ from: this.state.accounts[0] }).then((result) => {
                             alert("用户名设置成功");
                             console.log(result);
                             contract.methods.getName(this.state.accounts[0]).call().then((results) => {
                               console.log(results);
                               //let res = web3.utils.hexToUtf8(results);
                               this.setState({Username:results});
                             });
                           });
                         }}>设置用户名/重命名</Button>
                       <br/><br/>
                       <div>当前账户地址: <b>{this.state.accounts[0]}</b></div><br/>
                       <div>钱包账户余额: <b>{this.state.balance} eth</b> </div><br/>
                       <div>上传文件数量: <b>{this.state.Length}</b></div>
                       </Form>
                      </Card>
                    </Col>
                      <Col span={14} >
                      <Card title="区块链信息" bordered={true}>
                      <Form>
                           <div>当前区块链的块号 :<b>{this.state.blockNumber}</b></div><br/>
                           <div>当前区块链的hash :<b>{this.state.blockHash}</b></div><br/>
                           {
                             this.state.contractAddress
                               ? <h1>合约地址：{this.state.contractAddress}</h1>
                               : <h1>合约地址：暂无</h1>
                           }
                           <br/><div>当前交易hash :<b>{this.state.transactionHash}</b></div>
                       </Form>
                       </Card>
                       </Col>
                 </Row>
                 <br/>
                 <Row>
                 <div>

                 <h2>上传文件到IPFS：</h2>
                 <b>1.选择将文件上传到ipfs</b>
                <input type="file" ref="file" id="file" name="file" multiple="multiple"/>
                 <div>
                   <Button  type="primary" onClick={() => {
                       var file = this.refs.file.files[0];
                       console.log("file对象:  ");
                       console.log(file);

                       this.setState({ filename:file.name, filesize:file.size,uploadtime: new Date()})
                       var reader = new FileReader();
                       this.selectDB();
                       // reader.readAsDataURL(file);
                       reader.readAsArrayBuffer(file);
                       reader.onloadend = function(e) {
                         saveImageOnIpfs(reader).then((hash) => {
                           console.log("saveImageOnIpfs成功后返回的hash:");
                           console.log(hash);
                           this.setState({imgHash: hash})
                         });

                       }.bind(this);
                     }}>上传到IPFS</Button>
                 </div>
                 {
                   this.state.imgHash
                     ? <div>
                         <b>fileHash：{this.state.imgHash}</b>
                         <p>2.将ipfs返回的hash上传到区块链保存</p>
                         <Button  type="primary"  onClick={() => {
                           //contract.methods.set(5).send({ from: accounts[0] });
                             this.state.contract.methods.setFile(this.state.filename,this.state.imgHash,this.state.filesize,this.state.accounts[0],this.state.imgHash)
                             .send({from: this.state.accounts[0]}).then((result) => {
                               console.log(result); //这个result就包含所有需要的数据了
                               this.setState({blockHash: result.blockHash,blockNumber:result.blockNumber ,transactionHash:result.transactionHash});
                               this.state.contract.methods.getStr().call().then((data) => {
                                 console.log(data);
                                this.setState({blockChainHash: data,isWriteSuccess: true})
                             });
                           });

                         }}>记录区块链</Button>
                       </div>
                     : <div/>
                 }

                 {
                   this.state.isWriteSuccess
                     ? <div>
                         <h1>文件的hash已经写入到区块链！</h1>
                         <Button  type="primary"  onClick={() => {
                           this.handleDownExcel();
                           contract.methods.getFile(this.state.accounts[0]).call().then((result)=>{
                             this.setState({Length:result[0]})
                           });
                           this.insertDB(this.state.filename,
                           this.state.imgHash,
                           this.state.filesize,
                           this.state.accounts[0],
                           this.state.uploadtime,
                           this.state.status,
                           this.state.Username,
                           this.state.blockHash,
                           this.state.transactionHash);
                         }}> 查看 </Button>
                       </div>
                     : <div/>
                 }
                 {
                   this.state.blockChainHash
                     ? <div>
                         <h3>从区块链读取到的hash值：{this.state.blockChainHash}</h3>
                       </div>
                     : <div/>
                 }
                 {
                   this.state.blockChainHash
                     ? <div>
                         <img alt="" style={{width:200}} src={"http://localhost:8080/ipfs/" + this.state.imgHash}/>
                         <a href={"http://localhost:8080/ipfs/" + this.state.imgHash}>{"http://localhost:8080/ipfs/" + this.state.imgHash}</a>
                       </div>
                     : <img alt=""/>
                 }
                 </div>
                 </Row>

             <Breadcrumb style={{ margin: '16px 0' }}>
               <Breadcrumb.Item>共享文件列表</Breadcrumb.Item>
             </Breadcrumb>
             <Table columns={columns} dataSource={this.state.data} />

           </Layout>
         </Layout>
       </Layout>



    </div>
    );
  }
}

export default App;
