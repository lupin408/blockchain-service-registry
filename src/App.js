import './App.css';
import Web3 from 'web3';
import React from 'react';
import abi from './abicode.js'


//------------GRAPHICAL USER INTERFACE for the API -------------------

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     acct: 'placeholderacct',
     serviceregistrytosend: ['placeholder'],
     custid: 'Enter RegistryID',
     register: '',
     sortedreg: {},
     userid: '',
     regid: 'RegistryID'
  
    
    };
    //binding functions to scope
    this.getAccount = this.getAccount.bind(this);
    this.injectweb3andcontract = this.injectweb3andcontract.bind(this);
    this.submitregdata = this.submitregdata.bind(this);
    this.getreg = this.getreg.bind(this);
    this.sortreg = this.sortreg.bind(this);
    this.replaceloc = this.replaceloc.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
  }
 
  
  componentDidMount(b) {
    //check if client has metamask 
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      //connect to user metamask
      this.getAccount()
    }
}
//function 'injectweb3andcontract' connects to client's web3 and generated a contract interface to subsequently connect to 
//the window object
injectweb3andcontract(c) {
  //check if client has web3 provider other than modern metamask
  //if not, do nothing
 
    //function "load" connects contract interface to window object
  async function load() {
    window.contract = await loadContract();
  }
  //abi convetrted to JSON string
  var abi2 =  JSON.stringify(abi.abi)
  async function loadContract() {
  //previous test contract address: 0xeCefE44efcc1E771a2CF1D99e8037Fd47e37A84E
  //create new web3 instance
  var web3instance = new Web3(window.ethereum)
  //get contract interface and connect it to web3
  return await new web3instance.eth.Contract(JSON.parse(abi2), '0xf0fB31D088ce9C01132B3f70e9195E08fAf1F92d' );
  } 
  load();
  
}


//function 'getAccount' is the function that prompts user to allow page to connect to metmask and prompts them to
//connect to binance smart chain
async getAccount(b){
   //this is now the preffered method, .enable() is now deprecated
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //set first account in returned array to React state "acct"
  this.setState({acct: accounts[0]})
//check if client is connected to correct network
if (window.ethereum.chainId !== '0x61'){
  //if not, then prompt user to connect
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      //if chain has not been added, ask user if they want to add it automatically
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ chainId: '0x61', chainName: 'Smart Chain', rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] /* ... */ }],
        });
      } catch (addError) {
        // handle "add" error
        console.log('Error adding chain')
      }
    }
    // handle other "switch" errors
    console.log('Error switching networks')
  }
  
}
//connect to client web3 and generate connected web3 contract interface
this.injectweb3andcontract()

}
//function 'submitregdata' submits a new registry to the blockchain and recieves the respective registerID, storing the registerID 
//to React state. Contract function 'submitRegistry' requires an array of strings ('servicename ip' pairs)
async submitregdata(event){
  //prevent page from reloading, as this function is called from submitting a form
  event.preventDefault();

  //eliminate empty data before sending registry array argument to contract
  //clone the array from React state
  var prunedArray = this.state.serviceregistrytosend.slice()
  //iterate over array and remove empty data (strings that consist of a single space)
  for (let i = 0; i < prunedArray.length;){
    if (prunedArray[i] === ' '){
      prunedArray.splice(i, 1)
    } else {
      i++
    }
  }
console.log(prunedArray);
  //send transaction to contract using the cleaned data 
  window.contract.methods.submitRegistry(prunedArray).send({from: this.state.acct})
  .then(txOutput => {
    //accesses the emitted uint and stores it in React state
    this.setState({userid: txOutput.events.newRegistry.returnValues.value})
  })
}



//function 'getreg' queries the contract on the blockchain with the registryID and upon receipt, it stores the respective registry
//to React state
async getreg(){
  //calls the listgetter function of the blockchain contract
  window.contract.methods.listgetter(this.state.custid).call()
  //formats recieved registry data and stores it to React state, then seperately converts recieved registry data to string and 
  //stores it to React state
  .then(reg => {this.sortreg(reg); this.setState({register: JSON.stringify(reg)})})
  
}

//function 'sortreg' formats an array and stores the formatted result to React state
sortreg(inputArray){
  //creates middleman object to temporarily store data in before it goes to React state
  var tempregister = {}
  //iterate over the input array
  inputArray.forEach((stringpair, index) => {
  //splits up the name:ip pairs into arrays of length 2
  var rawregisterarr = stringpair.split(' ');
  //populates the tempregister object with a key of servicename and value of array containing ip and index of service in registry
  tempregister[rawregisterarr[0]] =  [rawregisterarr[1], index]
  })
  this.setState({sortedreg: tempregister})
}

//function 'handleChange1' updates React state whenever the 'submit new registry' form is updated
handleChange1(){
  this.setState({serviceregistrytosend: [document.getElementById('tf1').value +' '+ document.getElementById('tf2').value, document.getElementById('tf3').value + ' ' +document.getElementById('tf4').value, 
  document.getElementById('tf5').value +' '+ document.getElementById('tf6').value, document.getElementById('tf7').value + ' ' +document.getElementById('tf8').value,
  document.getElementById('tf9').value +' '+ document.getElementById('tf10').value, document.getElementById('tf11').value + ' ' +document.getElementById('tf12').value,
  document.getElementById('tf13').value +' '+ document.getElementById('tf14').value] })
}

//function 'handleChange2' updates React state whenever the input field for 'retrieve Register' is updated 
handleChange2(event){
  this.setState({custid: event.target.value})
}

//function 'handleChange3' updates React state whenever the input field for 'replace service location' is updated
handleChange3(event){
  this.setState({regid: event.target.value})
}

//function 'handleFocus' makes it so that user has the respective default text auto-selected when they click a text field
handleFocus(event){
  event.target.select();
}

//function 'replaceloc' sends transaction to the contract to update a specific registry on the blockchain
async replaceloc(){
  //assign variables to all arguments needed for the changeRegistry function call. Contract function changeRegistry 
  //requires an array of strings ('servicename ip' pairs), the id of the registry to be updated, and an array containing the 
  //indices of each service to be updated
  var servname = document.getElementById('servname1').value;
  var servip = document.getElementById('servip1').value;
  var servindex = this.state.sortedreg[servname][1];
  //send transaction from linked account
  window.contract.methods.changeRegistry([servname+' '+servip], this.state.regid, [servindex]).send({from: this.state.acct})
}

  
 //Render React component
 
  render() {
  return (
    <div className="App">
     {window.ethereum == undefined ?    <div>Please install metamask</div> : <div><button id='connectmetamaskbtn' onClick={this.getAccount}>Connect Metamask to BSC</button> 
     <form id='form1' onSubmit={this.submitregdata}> <label id='lbl1'>
          <h3>Submit new Registry:</h3>
          <h6 id='snh6'>Service names</h6><h6 id='iph6'>IP addresses</h6>
          <input type="text" id='tf1' defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />  <input id='tf2' type="text" defaultValue=''   onChange={this.handleChange1} onFocus={this.handleFocus} /> 
          <input type="text" id='tf3' defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />  <input id='tf4' type="text" defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />
          <input type="text" id='tf5' defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />  <input id='tf6' type="text" defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />
          <input type="text" id='tf7' defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />  <input id='tf8' type="text" defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />
          <input type="text" id='tf9' defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />  <input id='tf10' type="text" defaultValue=''   onChange={this.handleChange1} onFocus={this.handleFocus} /> 
          <input type="text" id='tf11' defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />  <input id='tf12' type="text" defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />
          <input type="text" id='tf13' defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} />  <input id='tf14' type="text" defaultValue='' onChange={this.handleChange1} onFocus={this.handleFocus} /> </label>
        <input id='submitbtn' type="submit" value="Submit" />
        <div id='returnedid'>RegistryID: {this.state.userid}</div>
      </form>
      <div className='methodbox' id='retrieveregisterdiv'>
        <h3>Retrieve Service Register</h3>
      <input type='text' id='retrieveregister' value={this.state.custid} onFocus={this.handleFocus} onChange={this.handleChange2}></input>
     <button onClick={this.getreg}>Get register</button>
     <div>{this.state.register}</div>
     </div>
     <div className='methodbox' id='replaceregisterdiv'>
       <h3>Change services' IP addresses</h3>
<input type = 'text' defaultValue='Service name' id='servname1' onFocus={this.handleFocus} ></input> <input type = 'text' defaultValue='New IP' id='servip1' onFocus={this.handleFocus}></input>
<input type= 'text' id='regid1' value={this.state.regid} onFocus={this.handleFocus} onChange={this.handleChange3}></input>
     <button id='replacebtn' onClick={this.replaceloc}>Replace service location</button>
     </div> 
     </div>
     }

     
 

     
    </div>
    
  );
}}

export default App;
