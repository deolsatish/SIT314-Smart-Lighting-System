var loginapp = angular.module('loginapp', []);
loginapp.controller('formCtrl', function ($scope, $http) {
    $scope.username = "";
    $scope.password = "";
    $scope.bool = false;
    $scope.submit = function () {
        console.log("submit entered");
        const user = $scope.username;
        const password = $scope.password;
        console.log("name: " + user);
        console.log("password: " + password);
        $.post(`${USER_SERVICE_URL}/authenticate`, { "name": user, "password": password })
            .then((response) => {

                if (response.success) {

                    localStorage.setItem('user', user);
                    localStorage.setItem('isAdmin', response.isAdmin);
                    localStorage.setItem('isAuthenticated', true);
                    location.href = '/';
                }
                else {
                    $scope.message = response;
                    $scope.bool = true;
                }
            });

    }
});
console.log("Entered login");