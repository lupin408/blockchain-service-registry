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
     acct: 'b'
    };
    this.getAccount = this.getAccount.bind(this);
    this.injectweb3andcontract = this.injectweb3andcontract.bind(this);
    this.submitregdata = this.submitregdata.bind(this);
    this.bg = this.bg.bind(this);
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
  /* window.contract.methods.test1([5, 2, 3]).call()
  .then(a => console.log(a)) */
  //var serv1 = ['hello',  'fiftyfour', 'he'];
  var serv2 = ['testone', 'testtwo', 'testthree'];
  console.log(this.state.acct)
  window.contract.methods.submitRegistry(serv2).send({from: this.state.acct})
}

  
 
 
 




  

  render() {
  return (
    <div className="App">
     {window.ethereum == undefined ?    <div>Please install metamask</div> : <div><button id='connectmetamaskbtn' onClick={this.getAccount}>Connect Metamask to BSC</button> <button id='submitreg' onClick={this.submitregdata}>Submit Reg</button></div> }

     
 

     
    </div>
    
  );
}}

export default App;
