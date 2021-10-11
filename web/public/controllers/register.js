var registerapp = angular.module('registerapp', []);
registerapp.directive('passwordvalidation', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, mCtrl) {
            function myValidation(value) {
                if (value.length >= 8) {
                    mCtrl.$setValidity('charE', true);
                } else {
                    mCtrl.$setValidity('charE', false);
                }
                return value;
            }
            mCtrl.$parsers.push(myValidation);
        }
    };
});
registerapp.controller('formCtrl', function ($scope) {
    $scope.username = "";
    $scope.password = "";
    $scope.confirm = "";
    $scope.email = "";
    var strength = "";
    $scope.grade = function () {
        var size = $scope.password.length;
        if (size > 12) {
            strength = 'strong';
        } else if (size > 8) {
            strength = 'medium';
        } else {
            strength = 'weak';
        }

        return strength;
    }
    $scope.register = function () {
        const user = $scope.username;
        const password = $scope.password;
        const confirm = $scope.confirm;
        const email_id = $scope.email;
        $scope.bool = false;
        const isAdmin = false;
        console.log("name: " + user);
        console.log("password: " + password);
        console.log("confirm: " + confirm);
        $.post(`${USER_SERVICE_URL}/authenticate`, { "name": user, "password": password })
            .then((response) => {
                console.log("response");
                console.log(response);
                if (password != confirm) {
                    $(".message").empty();
                    $(".message").append("<p> Your Password and Confirm Password inputs do not match.</p>");
                    //location.href = '/registration';
                }
                else {
                    $.post(`${USER_SERVICE_URL}/registration`, { "name": user, "password": password,"email_id":email_id, "isAdmin": isAdmin }).then((response) => {
                        if (response.success) {

                            $scope.bool = true;
                            console.log("registration successfull");
                            setTimeout(() => { location.href = '/login'; }, 7000);


                            $('#message').append(`<p class="ui message"id="error" style="color: tomato;"> Registration Successfull</p>`);
                        }
                        else {
                            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
                        }
                    });

                }
            });
    }
});