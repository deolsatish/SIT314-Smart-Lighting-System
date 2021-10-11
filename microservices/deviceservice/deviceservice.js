require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://deol:deol@sit314.x69lz.mongodb.net/SmartLightingDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 5010;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

console.log("API is working");

const MQTT_URL = `http://localhost:5040`

//const MQTT_URL = `http://3.91.247.241:5040`




const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


/**
* @api {get} /api/test tests if api is working
* @apiGroup Test
* @apiSuccessExample {String} Success-Response:
*"The API is working!"
*/
app.get('/api/test', (req, res) => {
    res.send('The API is working!');
    });
    app.listen(port, () => {
    console.log(`listening on port ${port}`);
});





const Device = require('./models/lightdevice');
const User = require('./models/user');

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup LightDevices
* @apiSuccessExample {json} Success-Response:
[
    {
        "_id": "61582bef5f9c79b412687f17",
        "device_name": "traffic light FSM FPGA test",
        "user_name": "daclan",
        "light_status": true,
        "status_history": [
            {
                "datetime": "Sun Oct 10 2021 19:32:57 GMT+1100 (Australian Eastern Daylight Time)",
                "field": "light_status",
                "value": true
            }
        ],
        "description": "Just a normal Led lihgt of only one color white",
        "locationdesc": "1 st floor cafetaria",
        "instructions": [],
        "rgb": "[245,242,230]",
        "brightness": "86",
        "__v": 1
    }
]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/
app.get('/api/devices', (req, res) => {
    console.log("Entered api/devices");
    console.log(Device);
    Device.find({}, (err, devices) => {
    if (err == true) 
    {
        console.log("adsasd");
        return res.send(err);
    } 
    else 
    {
        console.log("adsasd");
        return res.send(devices);
    }
    });
});



/**
* @api {post} /api/devices Register New Device
* @apiGroup LightDevices
* @apiSuccessExample {json} Success-Response:
*   { successfully added device and data }
* @apiParam {json}:
{
    "device_name": "traffic light FSM FPGA test",
    "user_name": "daclan",
    "description": "Just a normal Led lihgt of only one color white",
    "locationdesc": "1 st floor cafetaria",
    "rgb": "[245,242,230]",
    "brightness": "86",

}
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/  
app.post('/api/devices', (req, res) => {
    const { device_name, user_name, description, locationdesc, rgb, brightness } = req.body;
    var light_status= 0;
    var status_history=[];
    //var rgb=[255,255,255]; //This is white
    //var brightness=100;
    const newDevice = new Device({
    device_name,
    user_name,
    light_status,
    status_history,
    description,
    locationdesc,
    rgb,
    brightness
    });
    newDevice.save(err => {
    return err
    ? res.send(err)
    : res.send('successfully added device and data');
    });
});






/**
* @api {post} /api/devices/:deviceId/togglelights toggles ligth On/Off
* @apiGroup LightDevices
* @apiParam {json}:
* { "device_id":"2015-03-25T12:00:00Z", "value" : 46, "unit" : "F"}
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Light Status changed to true"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/
app.post('/api/devices/:device_id/togglelights', (req, res) => {    
    var { device_id } = req.params;
    Device.findOne({"_id": device_id }, (err, lightdevices) => {
        var {  light_status } = lightdevices;
        console.log(light_status);
        console.log(typeof(light_status));
        lightdevices.light_status=!light_status;
        console.log(light_status);
        var stringresponse=" Light Status changed to "+lightdevices.light_status.toString();



        var datenow= new Date();
        var d=datenow.toString();

        var history=
        {
            datetime:d,
            field:"light_status",
            value:lightdevices.light_status
        }

        lightdevices.status_history.push(history);





        lightdevices.save(err => {
            console.log(err);
            if(err)
            {
                console.log(err);
            }
        });

        sendcommand(device_id,"light_status",lightdevices.light_status);

        




        


        return err
        ? res.send(err)
        : res.send(stringresponse);
        });
    });











function sendcommand(device_id,command,value)
{
    var cmdbody = {
        deviceId:device_id.toString(),
        command:command.toString(),
        value:value.toString()
    };
    

    $.post(`${MQTT_URL}/send-command`, cmdbody)
        .then(response => {
            console.log("Sucessfully Send Command")
            })
        .catch(error => {
            console.error(`Error: ${error}`);
    });

}




















    /**
* @api {get} /api/devices/:deviceId/status_history returns all status changes with dattime when it exactly happened
* @apiGroup LightDevices
* @apiSuccessExample {json} Success-Response:
[
    {
        "datetime": "Sun Oct 10 2021 19:32:57 GMT+1100 (Australian Eastern Daylight Time)",
        "field": "light_status",
        "value": true
    },
    {
        "datetime": "Sun Oct 10 2021 19:43:52 GMT+1100 (Australian Eastern Daylight Time)",
        "field": "light_status",
        "value": false
    },
    {
        "datetime": "Mon Oct 11 2021 08:37:12 GMT+1100 (Australian Eastern Daylight Time)",
        "field": "light_status",
        "value": true
    }
]                   
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/

app.get('/api/devices/:deviceId/status_history', (req, res) => {
    const { deviceId } = req.params;
    console.log(deviceId);
    // to test in the browser http://localhost:5000/api/devices/5f50a23d25bb7a03a4af477e/device-history
    Device.findOne({"_id": deviceId }, (err, lightdevices) => {
    console.log(lightdevices);
    const { status_history } = lightdevices;
    console.log(status_history);
    return err
    ? res.send(err)
    : res.send(status_history);
    });
});



/**
* @api {post} /api/devices/:deviceId/status_history adds any new status changes as history
* @apiGroup LightDevices
* @apiParam {json}:
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Status History added"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/


app.post('/api/devices/:device_id/status_history', (req, res) => {
    var loc = req.body;
    console.log(loc);
    var { device_id } = req.params;
    Device.findOne({"_id": device_id }, (err, lightdevices) => {
        var {  status_history } = lightdevices;
        status_history.push(loc);
        console.log("AFter");
        var stringresponse=" Status History added ";
        lightdevices.save(err => {
            if(err)
            {
                console.log(err);
            }
        })
        return err
        ? res.send(err)
        : res.send(stringresponse);
        });
    });


























    /**
* @api {get} /api/devices/:deviceId/rgb returns RGB values of light
* @apiGroup LightDevices
* @apiSuccessExample {json} Success-Response:
*
*                    { [245,242,230]}
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/

app.get('/api/devices/:deviceId/rgb', (req, res) => {
    const { deviceId } = req.params;
    console.log(deviceId);
    // to test in the browser http://localhost:5000/api/devices/5f50a23d25bb7a03a4af477e/device-history
    Device.findOne({"_id": deviceId }, (err, lightdevices) => {
    console.log(lightdevices);
    const { rgb } = lightdevices;
    console.log(rgb);
    return err
    ? res.send(err)
    : res.send(rgb);
    });
});

/**
* @api {post} /api/devices/:deviceId/rgb Updates RGB value of light
* @apiGroup LightDevices
* @apiParam {json}:
{
    "rgb": "[145,122,230]"
}
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "RGB Status changed to [145,122,230]"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/


app.post('/api/devices/:device_id/rgb', (req, res) => {
    var loc = req.body;
    console.log(loc);
    var { device_id } = req.params;
    Device.findOne({"_id": device_id }, (err, lightdevices) => {
        var {  rgb } = lightdevices;
        lightdevices.rgb=loc.rgb;
        console.log(rgb);
        console.log("AFter");
        var stringresponse=" RGB Status changed to "+lightdevices.rgb.toString();


        var datenow= new Date();
        var d=datenow.toString();

        var history=
        {
            datetime:d,
            field:"rgb",
            value:lightdevices.rgb
        }

        lightdevices.status_history.push(history);






        lightdevices.save(err => {
            if(err)
            {
                console.log(err);
            }
        })
        sendcommand(device_id,"rgb",lightdevices.rgb);
        return err
        ? res.send(err)
        : res.send(stringresponse);
        });
    });








    /**
* @api {get} /api/devices/:deviceId/brightness returns brightness 
* @apiGroup LightDevices
* @apiSuccessExample {json} Success-Response:
*
*                    { 86 }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/

app.get('/api/devices/:deviceId/brightness', (req, res) => {
    const { deviceId } = req.params;
    console.log(deviceId);
    // to test in the browser http://localhost:5000/api/devices/5f50a23d25bb7a03a4af477e/device-history
    Device.findOne({"_id": deviceId }, (err, lightdevices) => {
    console.log(lightdevices);
    const { brightness } = lightdevices;
    console.log(brightness);
    return err
    ? res.send(err)
    : res.send(brightness);
    });
});


/**
* @api {post} /api/devices/:deviceId/brightness updates brightness value
* @apiGroup LightDevices
* @apiParam {json}:
{
    "brightness": 86
}
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Brightness Status changed to 120"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/


app.post('/api/devices/:device_id/brightness', (req, res) => {
    var loc = req.body;
    console.log(loc);
    var { device_id } = req.params;
    Device.findOne({"_id": device_id }, (err, lightdevices) => {
        var {  brightness } = lightdevices;
        lightdevices.brightness=loc.brightness;
        console.log(brightness);
        console.log("AFter");
        var stringresponse=" Brightness Status changed to "+lightdevices.brightness.toString();


        var datenow= new Date();
        var d=datenow.toString();

        var history=
        {
            datetime:d,
            field:"brightness",
            value:lightdevices.brightness
        }

        lightdevices.status_history.push(history);







        lightdevices.save(err => {
            if(err)
            {
                console.log(err);
            }
        })
        sendcommand(device_id,"brightness",lightdevices.brightness);
        return err
        ? res.send(err)
        : res.send(stringresponse);
        });
    });












    /**
* @api {post} /api/devices/:deviceId/description return description of light like led type, color-support
* @apiGroup LightDevices
* @apiParam {json}:
{
    "description":" It is a multi-color LED with dimming assist"

}
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Just a normal Led lihgt of only one color white"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/

app.get('/api/devices/:deviceId/description', (req, res) => {
    const { deviceId } = req.params;
    console.log(deviceId);
    // to test in the browser http://localhost:5000/api/devices/5f50a23d25bb7a03a4af477e/device-history
    Device.findOne({"_id": deviceId }, (err, lightdevices) => {
    console.log(lightdevices);
    const { description } = lightdevices;
    console.log(description);
    return err
    ? res.send(err)
    : res.send(description);
    });
});
    
    
/**
* @api {post} /api/devices/:deviceId/description updates description of light like led type, color-support
* @apiGroup LightDevices
* @apiParam {json}:
{
    "description":" It is a multi-color LED asdasd21with dimming assist"
}
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Description Status changed to It is a multi-color LED asdasd21with dimming assist"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/
    
app.post('/api/devices/:device_id/description', (req, res) => {
    var loc = req.body;
    console.log(loc);
    var { device_id } = req.params;
    Device.findOne({"_id": device_id }, (err, lightdevices) => {
        var {  description } = lightdevices;
        lightdevices.description=loc.description;
        console.log("AFter");
        var stringresponse=" Description Status changed to "+lightdevices.description.toString();


        var datenow= new Date();
        var d=datenow.toString();

        var history=
        {
            datetime:d,
            field:"description",
            value:lightdevices.description.toString()
        }

        lightdevices.status_history.push(history);




        lightdevices.save(err => {
            if(err)
            {
                console.log(err);
            }
        })
        
        return err
        ? res.send(err)
        : res.send(stringresponse);
        });
    });

        

/**
* @api {get} /api/devices/:deviceId/locationdesc returns information relatd to location
* @apiGroup LightDevices
* @apiParam {json}:
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "1 st floor cafetaria"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/




app.get('/api/devices/:deviceId/locationdesc', (req, res) => {
    const { deviceId } = req.params;
    console.log(deviceId);
    // to test in the browser http://localhost:5000/api/devices/5f50a23d25bb7a03a4af477e/device-history
    Device.findOne({"_id": deviceId }, (err, lightdevices) => {
    console.log(lightdevices);
    const { locationdesc } = lightdevices;
    console.log(locationdesc);
    return err
    ? res.send(err)
    : res.send(locationdesc);
    });
});
        
/**
* @api {post} /api/devices/:device_id/locationdesc Inputs location description
* @apiGroup LightDevices
* @apiParam {json}:
{
    "locationdesc":"1 st floor cafetaria"
}
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Location Description Status changed to 1 st floor cafetaria"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error"
*}
*/
       
app.post('/api/devices/:device_id/locationdesc', (req, res) => {
    var loc = req.body;
    console.log(loc);
    var { device_id } = req.params;
    Device.findOne({"_id": device_id }, (err, lightdevices) => {
        var {  locationdesc } = lightdevices;
        lightdevices.locationdesc=loc.locationdesc;
        var stringresponse=" Location Description Status changed to "+lightdevices.locationdesc.toString();
        console.log("AFter");



        var datenow= new Date();
        var d=datenow.toString();

        var history=
        {
            datetime:d,
            field:"locationdesc",
            value:lightdevices.locationdesc.toString()
        }

        lightdevices.status_history.push(history);

        



        lightdevices.save(err => {
            if(err)
            {
                console.log(err);
                }
            })
            return err
            ? res.send(err)
            : res.send(stringresponse);
    });
});
        




