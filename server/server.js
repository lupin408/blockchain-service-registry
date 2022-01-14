const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require("web3");
const ethNetwork = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
const path = require('path');
const app = express();
const abi = require('./abicode.js');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var abi2 =  JSON.stringify(abi.abi)
console.log(abi2, '16')
var contract = '';
async function loadContract() {
  
    return await new web3.eth.Contract(JSON.parse(abi2), '0xeCefE44efcc1E771a2CF1D99e8037Fd47e37A84E');
    
    } 
async function load() {
   
     contract = await loadContract();
  
  }
  
  
  

  
  
  load();
var localregistry = {
0: ['example twonine', 'elasticbean sixtyfour']    ,
1: ['exampletwo ninetyone', 'firsthound twentytwo']
}
var balance1 = '0';

app.use(express.static(path.join(__dirname, '../', 'build')));

app.get('/reqreg', (req, res) => {


 async function getreg(c){
     //console.log(contract)
    var reg1 = await contract.methods.listgetter('5').call()
   res.send(reg1)
  }

 getreg()
   
})
const PORT = 3000;



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
