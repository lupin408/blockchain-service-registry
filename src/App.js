import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import React from 'react';
import abi from './abicode.js'



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     reloadnum: 0,
     acct: 'b',
     srts: ['a'],
     custid: 'Enter RegisterID',
     register: '',
     sortedreg: {},
     userid: ''
  
    
    };
    this.getAccount = this.getAccount.bind(this);
    this.injectweb3andcontract = this.injectweb3andcontract.bind(this);
    this.submitregdata = this.submitregdata.bind(this);
    this.bg = this.bg.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.getreg = this.getreg.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.sortreg = this.sortreg.bind(this);
    this.changedata = this.changedata.bind(this);
    this.replaceloc = this.replaceloc.bind(this);
  }
 
  
  componentDidMount(b) {
 
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      this.bg()
      //console.log(window.ethereum.selectedAddress)
    }

 this.injectweb3andcontract();
 
}
  
injectweb3andcontract(c) {
  if (window.web3 == undefined) {

  } else {
  async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
  }
  
  async function load() {
    await loadWeb3();
    window.contract = await loadContract();
   
  }
  
  
  var abi2 =  JSON.stringify(abi.abi)
  console.log(abi2, typeof abi2)
  
  async function loadContract() {
  //0x328A072863D1AB1F9Fc094487ee0314c8E0d7523
  return await new window.web3.eth.Contract(JSON.parse(abi2), '0xeCefE44efcc1E771a2CF1D99e8037Fd47e37A84E');
  
  } 
  load();
  }
}
async bg(a) {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  this.setState({acct: account})
  console.log(account)
}

 async getAccount(b){
  
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
const account = accounts[0];
this.setState({acct: accounts[0]})
console.log(account);
console.log(window.ethereum)
if (window.ethereum.chainId !== '0x61'){
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: '0x61', chainName: 'Smart Chain', rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] /* ... */ }],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
  
}
this.injectweb3andcontract()

}

async submitregdata(b){
  b.preventDefault();
 
  console.log(this.state.acct)
  window.contract.methods.submitRegistry(this.state.srts).send({from: this.state.acct})
  .then(f => this.setState({userid: f}))
}

async changedata(c){
  var inputdata = [['b', 'a'], '5', ['1']]
  var params = window.web3.eth.abi.encodeParameters(['string[]', 'uint256', 'uint256[]'], inputdata);
       console.log(params)
  window.contract.methods.changeRegistry(['b', 'a'], '5', ['1']).send({from: this.state.acct})
  //.then(f => this.setState({custid: f}))
}

async handleChange1(event){
this.setState({srts: [document.getElementById('tf1').value +' '+ document.getElementById('tf2').value, document.getElementById('tf3').value + ' ' +document.getElementById('tf4').value] })
}

async getreg(c){
  window.contract.methods.listgetter(this.state.custid).call()
  .then(reg => {this.sortreg(reg); this.setState({register: JSON.stringify(reg)})})
  
}
sortreg(v){
  console.log(v)
  var tempregister = {}
  v.forEach((stringpair, index) => {
  var rawregisterarr = stringpair.split(' ');
 
  tempregister[rawregisterarr[0]] =  [rawregisterarr[1], index]
 
 
  })
  this.setState({sortedreg: tempregister})
  console.log(tempregister)
}


handleChange2(event){
  this.setState({custid: event.target.value})
}

async replaceloc(v){
  var servname = document.getElementById('servname1').value;
  var servip = document.getElementById('servip1').value;
  var servindex = this.state.sortedreg[servname][1];
  window.contract.methods.changeRegistry([servname+' '+servip], this.state.custid, [servindex]).send({from: this.state.acct})
}

  
 
 
 




  
//<button id='submitreg' onClick={this.submitregdata}>Submit Reg</button>
  render() {
  return (
    <div className="App">
     {window.ethereum == undefined ?    <div>Please install metamask</div> : <div><button id='connectmetamaskbtn' onClick={this.getAccount}>Connect Metamask to BSC</button> 
     
     <form id='form1' onSubmit={this.submitregdata}>        <label id='lbl1'>
          <h3>Submit new Registry:</h3>
          <input type="text" id='tf1'  onChange={this.handleChange1} />  <input id='tf2' type="text"  onChange={this.handleChange1} /> 
          <input type="text" id='tf3'  onChange={this.handleChange1} />  <input id='tf4' type="text"  onChange={this.handleChange1} /> </label>
        <input id='submitbtn' type="submit" value="Submit" />
        <div>{this.state.userid}</div>
      </form>
      <div className='methodbox' id='retrieveregisterdiv'>
        <h3>Retrieve Service Register</h3>
      <input type='text' value={this.state.custid} onChange={this.handleChange2}></input>
     <button onClick={this.getreg}>Get register</button>
     <div>{this.state.register}</div>
     </div>
     <div className='methodbox' id='replaceregisterdiv'>
       <h3>Change services' IP addresses</h3>
<input type = 'text' id='servname1'></input> <input type = 'text' id='servip1'></input>
     <button onClick={this.replaceloc}>Replace service location</button>
     </div> 
     </div>
     }

     
 

     
    </div>
    
  );
}}

export default App;
