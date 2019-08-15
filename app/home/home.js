'use strict';

angular.module('myApp.home', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])

.controller('HomeCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$location','CommonProp', '$firebaseAuth', function($scope, $firebaseArray, $firebaseObject, $location, CommonProp, $firebaseAuth) {
    //$scope.useremail = CommonProp.getUser();

    var usersRef = firebase.database().ref()


    var userUID = firebase.auth().currentUser.uid;

    //var temp = $firebaseObject(usersRef.child('users').child(userUID).child('username'));   

    console.log(userUID);


    //Aqui é feito uma busca assincrona dos dados no firebase.
    firebase.database().ref( '/users/' + userUID).once('value').then(function(snapshot) {
        var temp = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        console.log("chegou aqui: " + temp);
        $scope.username = temp;   
        $scope.$digest();   
    });

//Implementar depois a função de fazer o logout

   $scope.logout = function(){
       authObj = $firebaseAuth();
       authObj.$signOut().then(function() {
        console.log("Logout has been done sucessfully");
        $location.path('/login');
    }).catch(function(error) {
        console.log(error);
    });

    /*
    firebase.auth().$signOut().then(function() {
            console.log("Logout has been done sucessfully");
            $location.path('/login');
        }).catch(function(error) {
            console.log(error);
        });
*/

/*
        firebase.unauth().then(function() {
            console.log("Logout has been done sucessfully");
            $location.path('/login');
        }).catch(function(error) {
            console.log(error);
        });
*/
    }

}]);