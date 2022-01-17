# Primitive Blockchain Serivce Registry API

This project is simply a proof-of-concept for storing/changing/reading data pairs on the blockchain, specifically service names and their respective locations. Contract is currently deployed on Binance Smart Chain Testnet. An example API is running on https://ericsweb3api.com for people to use (feel free to send requests with Postman :smile:). Use lightly, only intended as an example (very small-scale use).

## GUI

Incase someone needs it, or you are having trouble sending API requests directly, there is a graphical user interface included in this project. It it hosted at the same location that the API requests are sent to. Simply open your browser to the location which server.js is listening.

## Available API requests

To the URL your server.js is listening at, you can send:

### `POST: /submitreg`

Submits your registry to the blockchain.
Server account address must have sufficient balance of currency to write to the blockchain.

Parameters are: 
````
{"newregisterservices":["SERVICE1_NAME", "SERVICE2_NAME", ... ], "newregisterips":["SERVICE1_IP", "SERVICE2_IP"]}
````

Example using JavaScript - Fetch

```

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"newregisterservices":["elastic-beanstalk","ledgerboard"],"newregisterips":["127.1.0.137","193.41.3.180"]});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://examplesite.com/submitreg", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

```

 ### `POST: /changereg`

Submits changes of IP addresses of your services to the blockchain.
Server account address must have sufficient balance of currency to write to the blockchain.

Parameters are: 
```
{"servicetochangearray":["SERVICE1_NAME", "SERVICE2_NAME", ... ], "iptochangearray":["NEW_IP1", "NEW_IP2"], "registerid": "REGISTER_ID_NUMBER"}
```

Example using JavaScript - Fetch

```

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"servicetochangearray":["name_of_service_to_udpate_ip_for1","name_of_service_to_udpate_ip_for2"],"iptochangearray":["service1_new_ip","service2_new_ip"],"registerid":"registeridnumber"});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://examplesite.com/changereg", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

```

### `GET: /reqreg`

Returns client's service register from the blockchain.
This does not require the server account address to have been funded.

Parameters are:
```
({"registerid": "REGISTER_ID_NUMBER"})
```

Example using JavaScript - Fetch

```

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"registerid":"register_id_number"});

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://examplesite.com/reqreg", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

  ```

### `GET: /fundapiuse`

Returns the address to fund. Writing to the blockchain requires that the server account wallet associated with the API user send the blockchain's native currency (amount depends on type and quantity of operations). This API requests returns the address the client should fund if balance runs out.


### Advanced Configuration

Can choose a specific port that the API listens to. Go into server/server.js and change '3000' on line 187 with your desired port.

### Deployment

In the directory that you download this project to, in the command line type:
```
npm install
```
Then type 
```
npm run build
```
then
```
node server/server.js
```
By default, it should be listening on port 3000.
If not being hosted locally, add the following line to your package.json file:
```
 "homepage":"EXAMPLE_HOMEPAGE",
```

### Miscellaneous

Functionality for adding services to a pre-existing registry will be added in v1.1