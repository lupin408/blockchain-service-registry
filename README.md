# Primitive Blockchain Serivce Registry API

This project is simply a proof-of-concept for storing/changing/reading data pairs on the blockchain, specifically service names and their respective locations.

## GUI

Incase someone needs it, or you are having trouble sending API requests directly, there is a graphical user interface included in this project. It it hosted at the same location that the API requests are sent to. Simply open your browser to the location which server.js is listening.

## Available API requests

To the URL your server.js is listening at, you can send:

### `POST: /submitreg`

Submits your registry to the blockchain.
Server account address must have sufficient balance of currency to write to the blockchain.

Parameters are: 
````
{"newregisterservices":["service1_name", "service2_name", ... ], "newregisterips":["service1_ip", "service2_ip"]}
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

fetch("http://localhost:3000/submitreg", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

```

 ### `POST: /changereg`

Submits changes of IP addresses of your services to the blockchain.
Server account address must have sufficient balance of currency to write to the blockchain.

Parameters are: 
```
{"servicetochangearray":["name_of_service_to_udpate_ip_for1", "name_of_service_to_udpate_ip_for2", ... ], "iptochangearray":["service1_new_ip", "service2_new_ip"], "clientid": "clientidnumber"}
```

Example using JavaScript - Fetch

```

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"servicetochangearray":["name_of_service_to_udpate_ip_for1","name_of_service_to_udpate_ip_for2"],"iptochangearray":["service1_new_ip","service2_new_ip"],"clientid":"clientidnumber"});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3000/changereg", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

```

### `GET: /reqreg`

Returns client's service register from the blockchain.
This does not require the server account address to have been funded.

Parameters are ({"registerid": "register_id_number"})

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

fetch("http://localhost:3000/reqreg", requestOptions)
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

