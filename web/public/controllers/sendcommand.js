var sendcommandapp = angular.module('sendcommandapp', []);

sendcommandapp.controller('formCtrl', function ($scope) {
    $scope.deviceId = "";
    $scope.command = "";
    $scope.send = function () {
        const deviceId = $scope.deviceId;
        const command = $scope.command;
        console.log("Attempting PUT");
        $.post(`${MQTT_URL}/send-command`, { deviceId, command }).then(response => {
            console.log("post entered");
            $('#message').append(`<p class="ui message" id="regsuccess" style="color: tomato;">Command Sent</p>`);
        });
        //console.log("send-commad entered "+deviceId+" "+command);
    }

    //$.post(`${MQTT_URL}/send-command`, { deviceId, command });
});
