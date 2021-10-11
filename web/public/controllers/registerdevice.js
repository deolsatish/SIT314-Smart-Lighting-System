
var adddeviceapp = angular.module('adddeviceapp', []);
adddeviceapp.controller('formCtrl', function ($scope) {
    $scope.username = "";
    $scope.name = "";
    $scope.babyname="";
    $scope.save = function () {
        const user_name = $scope.username;
        const device_name = $scope.name;
        const description = $scope.description;
        const locationdesc = $scope.locationdesc;
        const rgb = $scope.rgb;
        const brightness = $scope.brightness;
        console.log("username: " + user_name);
        console.log("name: " + device_name);
        console.log("description: " + description);
        console.log("locationdesc: " + locationdesc);
        console.log("rgb: " + rgb);
        console.log("brightness: " + brightness);
        
        const sensor_data = [];
        const body = {
            device_name,
            user_name,
            description,
            locationdesc,
            rgb,
            brightness
        };
        $.post(`${DEVICE_SERVICE_URL}/devices`, body)
            .then(response => {
                location.href = '/';
            })
            .catch(error => {
                console.error(`Error: ${error}`);
            });


    }
});