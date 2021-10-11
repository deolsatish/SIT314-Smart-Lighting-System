var notificationlist = [];
var notification1 = {
    "title": "Baby Monitor Notifications",
    "description": " Is this woaasd?"
};
var notification2 = {
    "title": "adasdasdBaby Monitor Notifications",
    "description": " Is this woaasd?"
};
var notification3 = {
    "title": "adasdasda111asdBaby Monitor Notifications",
    "description": " Is this woaasd?"
};
var notification4 = {
    "title": "1111111a1dasdasdBaby Monitor Notifications",
    "description": " Is this woaasd?"
};
notificationlist.push(notification1);
notificationlist.push(notification2);
notificationlist.push(notification3);
var notifyapp = angular.module('notifyapp', []);
notifyapp.controller('formCtrl', function ($scope, $http) {
    $scope.notlist = [];
    $scope.notlist = notificationlist;
    //console.log(notificationlist);
    //console.log($scope.notlist);
    $scope.deletenotification = function (index) {
        // delete notificationlist[index];
        // delete $scope.notlist[index];
        $.post(`${USER_SERVICE_URL}/users/${currentUser}/deletenotifications`, {index}).then((response)=>
        {
            console.log("Deleted Successfully");
        }).catch(error => {
            console.error(`Error: ${error}`);
        });
        notificationlist.splice(index, 1);

        //$scope.notlist.splice(index,1);
        console.log(notificationlist);
        console.log($scope.notlist);
    }
});