const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://deol:deol@sit314.x69lz.mongodb.net/SmartLightingDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5040;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

console.log("API is working");


/**
* @api {get} /api/test tests if api is working
* @apiGroup Test
* @apiSuccessExample {String} Success-Response:
*"The API is working!"
*/
app.get('/test', (req, res) => {
    res.send('The API is working!');
    });
    app.listen(port, () => {
    console.log(`listening on port ${port}`);
    });



const Device = require('./models/lightdevice');
const User = require('./models/user');





var maintopic="219325541";
var topic = maintopic +`/command`;





const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );



var mqtt = require('mqtt')

var options = {
    host: 'f44ec15210d74138a872435de2450726.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'baros',
    password: 'Deakin$12345'
}

//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});



client.on('connect', () => { 
    console.log('mqtt connected');
    client.subscribe(topic);
    //client.subscribe('/command/#');
});







var cmd;
var device_name;

app.get('/', (req, res) => {
    res.send('The mqtt send command Service is working!');
    });
    app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


/**
* @api {post} /api/send-command AllDevices Send Command
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*   { 
*       "published new message"
*   }
* @apiErrorExample {json} Error-Response: 
*   {
*       "Command does not exist" 
*   }
*/
app.post('/send-command', (req, res) => { 
    const data = req.body;

    
    var myJSON = JSON.stringify(data);

    console.log(myJSON);
    

    console.log(data);


    client.publish(topic, myJSON);
        console.log();
    
    
    res.send('published new message'); 

    console.log(req.body);
});



