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

const port = 5000;

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
app.get('/api/test', (req, res) => {
    res.send('The API is working!');
    });
    app.listen(port, () => {
    console.log(`listening on port ${port}`);
    });


app.get('/', (req, res) => {
    res.send('The account Service is working!');
    });




const Device = require('./models/lightdevice');
const User = require('./models/user');






/**
* @api {post} /api/authenticate Verifies User
* @apiGroup Users
* @apiParam {json}:
* {
*    "name": "Daclan",
*    "password": "deol$12345"  
*}
* @apiSuccessExample {json} Success-Response:{
*                    success: true,
*                    message: 'Authenticated successfully',
*                    isAdmin: result.isAdmin} 
* @apiErrorExample {String} Error-Response:
*Error:(User doesn't exist)The User in not in the Registration Database
*/
app.post('/api/authenticate', (req, res) => {
    const { name, password} = req.body;
    console.log("suthenticate name:"+name);
    console.log("authenticate password:"+password);
    User.findOne({"name":name}, (err, result) => {
        if(err)
        return err;
        console.log("Result");
        console.log(result);
        if(result==null)
        {
            res.send("Error:(User doesn't exist)The User in not in the Registration Database");
        }
        else
        {
            if(result.password==password)
            {
                console.log("password else");
                return res.json({
                    success: true,
                    message: 'Authenticated successfully',
                    isAdmin: result.isAdmin}
                );                
            }
            else
            {
                res.send("Error: Password is incorrect");
            }
        }
    });
});



/**
* @api {post} /api/registration Adds new Users
* @apiGroup Users
* @apiParam {json}:
* {
*    "name": "Daclan",
*    "password": "deol$12345",
*    "isAdmin":0
*        
*}
* @apiSuccessExample {String} Success-Response:
*"Created new user" 
* @apiErrorExample {String} Error-Response:
*"Error!!! User already exists"
*/
app.post('/api/registration', (req, res) => {
    const { name, password, email_id, isAdmin } = req.body;
    console.log(typeof(email_id));
    var notification_array=[];
    var notification12={
        "title":"Welcome !!",
        "description":"Welcome To Smart Lighting System"
    };
    notification_array.push(notification12);
    User.find({}, (err, users) => {
        console.log("users");
        console.log(users);
    });
    User.findOne({"name":name}, (err, result) => {
        if(err)
        return err;
        console.log("Result");
        console.log(result);
        if(result!=null)
        {
            res.send("Error!!! User already exists");
        }
        else
        {
            const newUser = new User({
                name: name,
                password,
                isAdmin,
                notification_array,
                email_id
            });
            newUser.save(err => {
                return err
                ? res.send(err)
                : res.json({
                success: true,
                message: 'Created new user'
                });
            });
        }
    });
});







/**
* @api {get} /api/users/:user/devices Returns device for specific user
* @apiGroup User
* @apiSuccessExample {String} Success-Response:
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
{
    "Device does not exist"
}
*/


app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user_name": user }, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices);
    });
});




    /**
* @api {get} /api/users/:user/notifications Displays Notifications 
* @apiGroup Users
* @apiSuccessExample {json} Success-Response:
*
*                    { "Notification result"}
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error:(User doesn't exist)The User in not in the Registration Database"
*}
*/
app.get('/api/users/:user/notifications', (req, res) => {
    const { user } = req.params;
    User.findOne({"name":user}, (err, result1) => {
        if(err)
        return err;
        console.log("Result");
        console.log(result1);
        if(result1==null)
        {
            res.send("Error:(User doesn't exist)The User in not in the Registration Database");
        }
        else
        {
            res.send(result1.notification_array);
        }
    });
});


// {
//     "title": "Baby Monitor Notifications",
//     "description": " Is this woaasd?"
// }



/**
* @api {post} /api/users/:user/notifications Inputs Notifications
* @apiGroup Users
* @apiParam {json}:
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Saved Sucessfully"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error:(User doesn't exist)The User in not in the Registration Database"
*}
*/
app.post('/api/users/:user/notifications', (req, res) => {
    const { user } = req.params;
    var nt=req.body;
    User.findOne({"name":user}, (err, result1) => {
        if(err)
        return err;
        console.log("Result");
        console.log(result1);
        var{ notification_array }=result1;
        notification_array.push(nt);
        result1.save(err => {
            if(err)
            {
                console.log(err);
            }
        })
        if(result1==null)
        {
            res.send("Error:(User doesn't exist)The User in not in the Registration Database");
        }
        else
        {
            res.send("Saved Successfully");
        }
    });
});


/**
* @api {post} /api/users/:user/deletenotifications Deletes Notifications
* @apiGroup Users
* @apiParam {json}:
{
    "index":2
}
* @apiSuccessExample {String} Success-Response:
*                    {
*                        "Saved Sucessfully"
*                    }
*                    
* @apiErrorExample {String} Error-Response:
*{
*                       "Error:(User doesn't exist)The User in not in the Registration Database"
*}
*/
app.post('/api/users/:user/deletenotifications', (req, res) => {
    const { user } = req.params;
    console.log("Entered delete notifications");
    var {index}=req.body;
    console.log(index);
    User.findOne({"name":user}, (err, result1) => {
        if(err)
        return err;
        console.log("Result");
        
        var{ notification_array }=result1;
        notification_array.splice(0,1);
        //notification_array.pop({});
        console.log(notification_array);
        result1.save(err => {
            if(err)
            {
                console.log(err);
            }
        })
        if(result1==null)
        {
            res.send("Error:(User doesn't exist)The User in not in the Registration Database");
        }
        else
        {
            res.send("Saved Successfully");
        }
    });
});





