$('#navbar').load('navbar.html');
$('#footbar').load('footer.html');

// const USER_SERVICE_URL = 'http://accountserviceloadbalancer-447041774.us-east-1.elb.amazonaws.com:5000/api';

// const DEVICE_SERVICE_URL = 'http://deviceserviceloadbalancer-317546385.us-east-1.elb.amazonaws.com:5010/api';


const USER_SERVICE_URL = 'http://localhost:5000/api';

const DEVICE_SERVICE_URL = 'http://localhost:5010/api';



//const API_URL = 'http://localhost:5000/api';




const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated')) || false;
const currentUser = localStorage.getItem('user');
var current_device = localStorage.getItem('current_device') || "";


var navapp=angular.module('navapp',[]);
console.log("Code started running");

var devicelist=[];
var deviceId;

$.get(`${USER_SERVICE_URL}/users/${currentUser}/devices`).then(response => {
    for (var i = 0; i < response.length; i++) {
        //console.log(response[0].device_name);
        var deviceinfo = { "deviceName": response[i].device_name, "deviceId": String(response[i]._id) };
        devicelist.push(deviceinfo);
    }
    //deviceId=response[0]._id;
    deviceId = current_device;


    // console.log("Response");
    // console.log (response);
    // console.log("deviceList");
    // console.log(devicelist);

}).catch(error => {
    console.error(`Error: ${error}`);
});
console.log(devicelist);




if (currentUser) 
{
    console.log("Logged in Perfectly");
    $.get(`${USER_SERVICE_URL}/users/${currentUser}/devices`)
        .then(response => {
            response.forEach((device) => {
                //console.log("'#devices tbody'");
                currentDevice = device;
                deviceName = currentDevice.device_name;
                console.log(device);
                light_status=String(device.light_status);
                var device_id=device._id.toString();
                console.log(device_id);


                $('#devices tbody').append(`
                    <tr data-device-id=${device._id}>
                    <td><button class=" ui brown basic button">${device.user_name}</button></td>
                    <td><button class=" ui purple basic button">${device.device_name}</button></td>
                    <td><button id="light_status" class=" ui red button">${light_status}</button></td>
                    <td><button id="desc" class=" ui brown basic button">${device.description}</button></td>
                    <td><button id="locdesc" class=" ui blue basic button">${device.locationdesc}</button></td>
                    <td><button id="rgb" class=" ui black basic button">${device.rgb.toString()}</button></td>
                    <td><button id="brightness" class=" ui black yellow basic button">${device.brightness.toString()}</button></td>
                    <td><button id="togglebutton" class=" ui teal button">On/Off Light</button></td>
                    </tr>`
                );
                if(device.light_status)
                {
                    document.getElementById("light_status").className="small ui olive button";
                }
           
                $('#devices-small tbody').append(`
                <tr data-device-id=${device._id}>
                <td>${device.user_name}</td>
                <td>${device.device_name}</td>
                </tr>
                `);
                
        });

        $('#devices tbody tr').on('click','button', function (e) {

            console.log("Clicl ENtered");

            var device_id = $(this).parents('tr').attr('data-device-id');
            current_device = device_id;
            //console.log(current_device);
            localStorage.setItem('current_device', current_device);
            //deviceId = e.currentTarget.getAttribute('data-device-id');
            //var trid = $(this).attr('data-device-id'); 
            //var trid = $(this).getAttribute('data-device-id');
            console.log(typeof(device_id));
            var action = this.id;
            console.log(action.toString());

            if(action=='togglebutton')
            {
                console.log("Sucessfully Toggle button");
                $.post(`${DEVICE_SERVICE_URL}/devices/${deviceId}/togglelights`, {}).then((response)=>
                {
                    console.log("Toggle SUccessfull Successfully");
                }).catch(error => {
                    console.error(`Error: ${error}`);
                });
                location.href="/Smart-Light-Devices-List";
            }
            // if(action=='editbutton')
            // {
            //     console.log("Sucessfully Edit button");
            //     location.href="/Smart-Light-Devices-List";
            // }


            if (action == 'sound') {
                location.href = `/${action}`;

            }
            else if (action == 'temp') {
                console.log('Button Temp:' + deviceId);
                location.href = `/${action}`;
            }
            else if (action == 'infrared') {
                console.log('Button IR:' + deviceId);
                location.href = `/${action}`;
            }
            else if (action == 'accelerometer') {
                console.log('Button Accel:' + deviceId);
                location.href = `/${action}`;
            }
            else if (action == 'humid') {
                console.log('Button Accel:' + deviceId);
                location.href = `/${action}`;
            }
            else if (this.id == 'add') {
                const instruct = $('#instruct').val();
                console.log(`Instruction is: ${instruct}`);

                instruct_body = {
                    instruct
                }

                $.post(`${DEVICE_SERVICE_URL}/devices/${deviceId}/instructions`, instruct_body)
                    .then(response => {
                        console.log("Added data");
                    })
            }
            //This has an error
            else if (this.id == 'view') {                    
                console.log("working ");
                var instruct_array = [];

                var notes = $.ajax({
                    async: false,
                    url: `${DEVICE_SERVICE_URL}/devices/${deviceId}/instructions`,
                    type: 'get',
                    data: { 'GetConfig': 'YES' },
                    dataType: "JSON"
                }).responseJSON;
                console.log(notes);
                $('#historyContent').empty();
                for(var i=0;i<notes.length;i++)
                {
                    
                    $('#historyContent').append(`<tr><td class="collapsing">
                    <i class="caret right icon"></i> ${notes[i].instruct}
                  </td></tr>`);
                }
                $('.ui.modal').modal('show');
            }


        });

        })


        .catch(error => {
            console.log(`Error: ${error}`);
        });



        
       
}
else 
{
    const path = window.location.pathname;

    //users should login before tgey can see other pages
    if (path !== '/login' && path !== '/registration') {
        location.href = '/login';
    }
}


const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
};


var devapp = angular.module('devapp', []);
var getapp = angular.module('getapp', []);


var notification1 = {
    "title": " Smart Lighting System Notifications",
    "description": " Is this woaasd?"
};
var notification2 = {
    "title": "adasdasdSmart Lighting System Notifications",
    "description": " Is this woaasd?"
};
var notification3 = {
    "title": "adasdasda111asdSmart Lighting System Notifications",
    "description": " Is this woaasd?"
};
var notification4 = {
    "title": "1111111a1dasdasdSmart Lighting System Notifications",
    "description": " Is this woaasd?"
};