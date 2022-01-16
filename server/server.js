const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require("web3");
const ethNetwork = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
const path = require('path');
const app = express();
const abi = require('./abicode.js');
const ethTx = require('ethereumjs-tx').Transaction
const Common = require('ethereumjs-common').default;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//--------------Custom Chain ---------------------
//as this project runs on Binance Smart Chain - Testnet by default, it requies this custom chain object for
//ethereumjs-tx, as ethereumjs-tx does not have native support for Binance Smart Chain - Testnet.

const customCommon = Common.forCustomChain(
    'mainnet',
    {
      name: 'bnb',
      networkId: 97,
      chainId: 97,
    },
    'petersburg',
  )

  
// ----------- CONTRACT INTERFACE -------------------

//converting ABI as a JSON string
var abi2 =  JSON.stringify(abi.abi)

var contract = '';

//loading contract to web3 using the ABI and blockchain address
async function loadContract() {
    return await new web3.eth.Contract(JSON.parse(abi2), '0xf0fB31D088ce9C01132B3f70e9195E08fAf1F92d');
    } 
async function load() {
     contract = await loadContract();
  }
     load();


//--------------ADDRESS/ACCOUNT GENERATION----------------     
var acct1 = web3.eth.accounts.create('newentropy')

//links the web3 instance with access to acct1. acct1 can be substituted with a string of any private key,
//but this is not recommended unless it is an account generated specifically for this purpose
var acctul = web3.eth.accounts.privateKeyToAccount(acct1.privateKey)


//--------------LOCAL (NON-BLOCKCHAIN) REGISTRY MIRRORS------------------------
//these are used to minimize gas costs on the blockchain by allowing simpler contract functions (by doing 
//operations that result in convenience to the end user, but are not necessary to the functioning of the
// contract) while not sacrificing the immutability and decentralization offered by the blockchain

//localregistry is an object that stores the raw registries locally with each registry being an array of
// strings paired to a key (the key being the respective registerID)
var localregistry = {}

//sortedlocalregistry is an object that stores the sorted registries locally, with each name:ip pair being 
//a key:value pair in an array which is tied to a key (the key being the respective registerID)
var sortedlocalregistry = {}


//sortlocal is a function that sorts the raw strings into a cleaner format to be put in sortedvalueregistry
    //should only be called internally
function sortlocal(clientidnum){
    //if called with an argument, sort only that registry
    if (clientidnum !== undefined) {
        //iterates over each array of name:ip pairs (name and ip seperated by ' ')
            localregistry[clientidnum].forEach((stringpair, index) => {
                //splits each pair into an array, with name being index 0 and ip being index 1
                let stringarray1 = stringpair.split(' ');
                //if that registry id has not been populated in the sortedregistry object yet, generate empty array
                if (sortedlocalregistry[clientidnum] == undefined) {
                    sortedlocalregistry[clientidnum] = [];
                }
                //put empty object at respective index in the array paired to the clientid key in
                // sortedlocalregistry and add the name:ip pair as key:value pair
                sortedlocalregistry[clientidnum][index] = {};
                sortedlocalregistry[clientidnum][index][stringarray1[0]] = stringarray1[1];
            })
    //if called without an argument, sort all the raw registry arrays
    } else {
        //iterates over each key in localregistry object
        for (var clientreg in localregistry) {
            //iterates over each name:ip pair in the array paired to the clientreg key in localregistry (name 
            //and ip seperated by ' ')
            localregistry[clientreg].forEach((stringpair, index) => {
                let stringarray2 = stringpair.split(' ');
                //if that registry id has not been populated in the sortedregistry object yet, generate empty array
                if (sortedlocalregistry[clientreg] == undefined) {
                    sortedlocalregistry[clientreg] = [];
                }
                //put empty object at respective index in the array paired to the clientreg key in
                // sortedlocalregistry and add the name:ip pair as key:value pair
                sortedlocalregistry[clientreg][index] = {};
                sortedlocalregistry[clientreg][index][stringarray2[0]] = stringarray2[1];
                
            })
        }
    }
   
}


//---------------HANDLING API REQUESTS---------------------

//serve build folder to client (for the purpose of allowing client to access the GUI if desired)
app.use(express.static(path.join(__dirname, '../', 'build')));

//'/reqreg' GET request returns the registry directly from the blockchain. Expects "resgisterid" string containing
//desired registryID.
//For more details on argument formatting, please see the README.md
app.get('/reqreg', (req, res) => {

 async function getreg(regid){
     //calls the listgetter function of the contract
    var reg1 = await contract.methods.listgetter(req.body.registerid).call()
    localregistry[regid] = reg1;
    //sorts the just-recieved raw data to cleaner data in sortedlocal object
    sortlocal(req.body.registerid)
    //responds to client with their blockchain-stored service registry
    res.send(reg1)
  }
  //make sure client sent appropriate parameters
  if (req.body.registerid !== undefined){
    getreg(req.body.registerid)
  //otherwise send error message 
  } else {
      //status code 400 is the error code for bad request
      res.status(400).send('missing registerid parameter')
  }
  
 
  
})



//'/changereg' POST request changes the IP address string in the specified registry stored on the blockchain. Expects
//array "servicetochangearray" containing strings of services to change the ip for, array "iptochangearray" containing
//strings of new ips to change to, and lastly a "clientid" string specifying the desired registry to change.
//For more details argument formatting, please see the README.md
app.post('/changereg', (req, res) => {

    //check if correct arguments were sent
    if ((req.body.servicetochangearray !== undefined) && (req.body.iptochangearray !== undefined) && (req.body.clientid !== undefined)) {
  var changeservicearray = req.body.servicetochangearray;
  var changeiparray = req.body.iptochangearray;
  var clientid = req.body.clientid + '';

  //contract expects array of index numbers to change the IPs at. 
  var indexarray = [];

  //contract expects array of service names to change the IPs for.
  var changeservicestosend = [];

  //refreshlocal function makes sure there is an up-to-date mirror of the registry-to-be-changed stored on the blockchain. This is
  // because the server needs to send the correct index numbers of the IPs-to-be-changed to the blockchain
  async function refreshlocal(){

      //if sortedregistry does not have data for that id, then it will retrieve it from the blockchain
    if (sortedlocalregistry[req.body.clientid] == undefined){
        localregistry[req.body.clientid] = await contract.methods.listgetter(req.body.clientid).call()
     
        return localregistry[req.body.clientid]
        //NOTE: once a register is in the localregistry, it will be updated serverside every time it gets update clientside, so it
        //is always up to date after it first gets populated in localregistry.
    }
  }

  //changedata function prepares the transaction to send to the blockchain and then sends it.
  async function changeregdata(b){
    const privKey = Buffer.from(acctul.privateKey.slice(2), 'hex')
    //uses the contract interface to acquire the data to be sent
    const transaction = contract.methods.changeRegistry(changeservicestosend, clientid, indexarray)
    //get estimated gas price for transaction and convert to 0x-prefaced hexidecimal
    const gasPrice = await web3.eth.getGasPrice()
    const gasPriceHex = '0x' + parseInt(gasPrice ).toString(16);
    //get estimated gas limit for transaction and convert to 0x-prefaced hexidecimal
    const gasLimitHex = '0x' + parseInt('3000000').toString(16);
    //get nonce for account the server is using
    var noncey = await web3.eth.getTransactionCount(acctul.address)

    const options = {
        nonce: web3.utils.toHex(noncey),
        to: '0xf0fB31D088ce9C01132B3f70e9195E08fAf1F92d',
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: transaction.encodeABI(),
        value: '0x00'
      };
      //prepare transaction to be sent (on custom network 'Binance Smart Chain - Testnet' by default)
      var tx = new ethTx(options, {common: customCommon})
      tx.sign(privKey);
      var serializedTx = tx.serialize();
      var rawTxHex = '0x' + serializedTx.toString('hex');
      //send transaction
      web3.eth.sendSignedTransaction(rawTxHex)
      .on('receipt', receipt => { console.log('Receipt: ', receipt);
    //send client confirmation
    res.send('succesfully submitted')
    //update local register mirrors
    sortlocal(req.body.clientid)
})
    //error handling
    .catch(error => { console.log('Error: ', error.message);
res.send('error changing your registry on the blockchain')
});
 
  }
  
  refreshlocal()
  .then(f => {
      //sort local register mirrors to reflect change
      sortlocal(req.body.clientid)
      sortedlocalregistry[req.body.clientid].forEach((servippair, index) => {
        changeservicearray.forEach((servtochange, index1) => {
            if (servippair[servtochange] !== undefined){
                changeservicestosend.push(servtochange + " " + changeiparray[index1]);
                localregistry[clientid][index] = servtochange + " " + changeiparray[index1]
                indexarray.push(index + '');
                
            }
        })
    }) 
    changeregdata() 
    }
    
    )
        //if incorrect parameters
    } else {
        //status code 400 is the error code for bad request
        res.status(400).send('incorrect/missing parameters')
    }
   
})
//'/fundapiuse' GET request returns the address that the server is using to communicate with the blockchain. Must have sufficient fund to
//send transactions that requiring writing to the blockchain
app.get('/fundapiuse', (req, res) => {
 res.send(acct1.address)
})

//'/submitreg' POST request calls the 'submitRegistry' function on the contract to add a new service registry to the blockchain contract 
//and emits a return value of the registerID of the new register
app.post('/submitreg', (req, res) => {
    //check parameters are formatted properly
    if (Array.isArray(req.body.newregisterservices) && Array.isArray(req.body.newregisterips)) {
    //object to temporarily store new registry until we send the transaction and get a registerID to store it in localregistry under
    var newregistry = []
    //populate newregistry object in the same format as registries of localregistry
    for (let j = 0; j < req.body.newregisterservices.length; j++){
        newregistry.push(req.body.newregisterservices[j] + ' ' + req.body.newregisterips)
    }

//sumbitregdata function prepares the transaction to send the blockchain and parses the emitted data
    async function submitregdata(b){
        const privKey = Buffer.from(acctul.privateKey.slice(2), 'hex')
        //uses the contract interface to acquire the data to be sent
        const transaction = contract.methods.submitRegistry(newregistry)
        //get estimated gas price for transaction and convert to 0x-prefaced hexidecimal
        const gasPrice = await web3.eth.getGasPrice()
        const gasPriceHex = '0x' + parseInt(gasPrice ).toString(16);
        //get estimated gas limit for transaction and convert to 0x-prefaced hexidecimal
        const gasLimitHex = '0x' + parseInt('3000000').toString(16);
        //get nonce for account the server is using
        var noncey = await web3.eth.getTransactionCount(acctul.address)
        const options = {
            nonce: web3.utils.toHex(noncey),
            to: '0xf0fB31D088ce9C01132B3f70e9195E08fAf1F92d',
            gasPrice: gasPriceHex,
            gasLimit: gasLimitHex,
            data: transaction.encodeABI(),
            value: '0x00'
          };
          //prepare transaction to be sent (on custom network 'Binance Smart Chain - Testnet' by default)
          var tx = new ethTx(options, {common: customCommon})
          tx.sign(privKey);
          var serializedTx = tx.serialize();
          var rawTxHex = '0x' + serializedTx.toString('hex');
          //send transaction
          web3.eth.sendSignedTransaction(rawTxHex)
          .on('receipt', receipt => { console.log('Receipt: ', receipt);
        //send client confirmation
        res.send('succesfully submitted')
        //parse emitted data
        var newregid = parseInt(receipt.logs.data, 16).toString()
    //add to local register mirrors
    localregistry[newregid] = newregistry;
    sortlocal(newregid)
    
    })
        //error handling
        .catch(error => { console.log('Error: ', error.message);
    res.send('error uploading your registry to the blockchain')
 });
     
      }
      submitregdata();
      //if incorrect parameters
    } else {
        //status code 400 is the error code for bad request
        res.status(400).send('incorrect/missing parameters')
    }
})

//Port number to listen on. Default is 3000
const PORT = 3000;


//start listening
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
