'use strict';

angular.module('myApp.login', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
    });
}])

.controller('LoginCtrl', ['$scope', '$location', 'CommonProp', '$firebaseAuth', function($scope, $location,CommonProp, $firebaseAuth) {
    $scope.user = {};

    $scope.signIn = function(){
        var username = $scope.user.email;
        var password = $scope.user.password;
        var auth = $firebaseAuth();

        auth.$signInWithEmailAndPassword(username, password).then(function(){
            console.log("Login done successfully!");
            $scope.errMsg = false;
            CommonProp.setUser($scope.user.email);
            $location.path('/home');           
        }).catch(function(error){
            $scope.errMsg = true;
            $scope.errorMessage = error.message;
        });
    }

}])

.service('CommonProp', function() {
    var user = '';
 
    return {
        getUser: function() {
            return user;
        },
        setUser: function(value) {
            user = value;
        }
    };
});