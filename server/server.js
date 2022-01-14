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
var abi2 =  JSON.stringify(abi.abi)
var clientnum = 6;
console.log(abi2, '16')
var contract = '';
async function loadContract() {
  
    return await new web3.eth.Contract(JSON.parse(abi2), '0xeCefE44efcc1E771a2CF1D99e8037Fd47e37A84E');
    
    } 
async function load() {
   
     contract = await loadContract();
  
  }
  
  
  

  
  
  load();
var acct1 = web3.eth.accounts.create('newentropy')
console.log(acct1)
var acctul = web3.eth.accounts.privateKeyToAccount(acct1.privateKey)
var localregistry = {
0: ['example twonine', 'elasticbean sixtyfour']    ,
1: ['exampletwo ninetyone', 'firsthound twentytwo']
}
var balance1 = '0';

app.use(express.static(path.join(__dirname, '../', 'build')));

app.get('/reqreg', (req, res) => {
 async function getreg(clientid){
     //console.log(contract)
    var reg1 = await contract.methods.listgetter('5').call()
    localregistry[clientid] = reg1;
   res.send(reg1)
  }

 getreg(req.body.clientid)
   
})

app.post('/changereg', (req, res) => {

})

app.get('/fundapiuse', (req, res) => {
 res.send(acct1.address)
})

app.post('/submitreg', (req, res) => {

    if (Array.isArray(req.body.newregistry)) {
    async function submitregdata(b){

        const customCommon = Common.forCustomChain(
            'mainnet',
            {
              name: 'bnb',
              networkId: 97,
              chainId: 97,
            },
            'petersburg',
          )

console.log(acctul)
        const privKey = Buffer.from(acctul.privateKey.slice(2), 'hex')
        const transaction = contract.methods.submitRegistry(req.body.newregistry)
        console.log(transaction.encodeABI(), 'hi')
     
        const gasPrice = await web3.eth.getGasPrice()
        console.log(gasPrice)
        const gasPriceHex = '0x' + parseInt(gasPrice ).toString(16);
        const gasLimitHex = '0x' + parseInt('3000000').toString(16);
        var noncey = await web3.eth.getTransactionCount(acctul.address)
        console.log(web3.utils.toHex(noncey), noncey)
console.log(gasLimitHex, gasPriceHex, 'gaslimit, gasprice')
        const options = {
            nonce: web3.utils.toHex(noncey),
            to: '0xeCefE44efcc1E771a2CF1D99e8037Fd47e37A84E',
            gasPrice: gasPriceHex,
            gasLimit: gasLimitHex,
            data: transaction.encodeABI(),
            value: '0x00'
            
           
          };
         
          console.log(transaction.encodeABI())
          console.log(privKey)
          var tx = new ethTx(options, {common: customCommon})
        
          tx.sign(privKey);
          var serializedTx = tx.serialize();
          var rawTxHex = '0x' + serializedTx.toString('hex');
          


          web3.eth.sendSignedTransaction(rawTxHex)
          .on('receipt', receipt => { console.log('Receipt: ', receipt);
        res.send('succesfully submitted')
    localregistry[clientnum] = req.body.newregistry;
    })
        .catch(error => { console.log('Error: ', error.message);
    res.send('error uploading your registry to the blockchain')
 });
     
      }
      submitregdata();
    }
})


const PORT = 3000;



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
