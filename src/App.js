import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import React from 'react';
import abi from './abicode.js'



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     reloadnum: 0
    };
    this.getAccount = this.getAccount.bind(this);
    this.injectweb3andcontract = this.injectweb3andcontract.bind(this);
  }
 
  
  componentDidMount(b) {
    
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }

 
 
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
  
  return await new window.web3.eth.Contract(JSON.parse(abi2), '0xe97999a2Da794bfE703B2FB053B59f16b920Ec8A');
  
  } 
  load();
  }
}

 async getAccount(b){
  
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
const account = accounts[0];
console.log(account);
console.log(window.ethereum)
if (window.ethereum.chainId !== '0x38'){
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x38' }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: '0x38', chainName: 'Smart Chain', rpcUrls: ['https://bsc-dataseed.binance.org/'] /* ... */ }],
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
  
 
 
 




  

  render() {
  return (
    <div className="App">
     {window.ethereum == undefined ?    <div>Please install metamask</div> : <button id='connectmetamaskbtn' onClick={this.getAccount}>Connect Metamask to BSC</button> }

     
 

     
    </div>
    
  );
}}

export default App;
