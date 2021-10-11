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





const DEVICE_SERVICE_URL = 'http://deviceserviceloadbalancer-317546385.us-east-1.elb.amazonaws.com:5010/api';















const { JSDOM } = require( "jsdom" );

const { window } = new JSDOM( "" );

const $ = require( "jquery" )( window );







var mqtt = require('mqtt');



var term = require( 'terminal-kit' ).terminal ;







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

    client.subscribe('219325541/#');



});



var maintopic="219325541";

var topic = maintopic +`/command/#`;



client.on('message', (topic, message) => 

{



    term.bgDefaultColor.white("Topic is: " + topic);

    console.log("Topic is: " + topic);

    console.log("Message is: " + message);

    var data=JSON.parse(message);

    console.log("parsed Messgae");

    //console.log(data);



    var rgb = $.ajax({

        async: false,

        url: `${DEVICE_SERVICE_URL}/devices/${data.deviceId}/rgb`,

        type: 'get',

        data: { 'GetConfig': 'YES' },

        dataType: "JSON"

    }).responseJSON;



    



    // console.log(rgb);



    // console.log(rgb[0]);

    // console.log(rgb[1]);

    // console.log(rgb[2]);







    term.bgColorRgb(rgb[0],rgb[1],rgb[2]).white(message);





    

});



// 

 

// // The term() function simply output a string to stdout, using current style

// // output "Hello world!" in default terminal's colors

// term( 'Hello world!\n' ) ;

 





// term.bgColorRgb(255,200,200).black("sdasdasdasdasdasd");



// term( 'Hello world!\n' ) ;