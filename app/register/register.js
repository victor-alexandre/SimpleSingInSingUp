'use strict';

angular.module('myApp.register', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'register/register.html',
        controller: 'RegisterCtrl'
    });
}])

.controller('RegisterCtrl', ['$scope', '$firebaseArray', '$firebaseObject', '$location', '$firebaseAuth', function($scope, $firebaseArray, $firebaseObject, $location, $firebaseAuth) {

    $scope.validatePassword = function(){
        var password = $scope.user.password;
        var confirmPassword = $scope.user.confirmPassword;
        if(password === confirmPassword){
            $scope.passwordError = false;
        }
        else{
            $scope.passwordError = true;           
        }
    }

    $scope.signUp = function(){
        var username = $scope.user.name;
        var useremail = $scope.user.email;
        var password = $scope.user.password;

        if(useremail && password){
            var auth = $firebaseAuth();

            auth.$createUserWithEmailAndPassword(useremail, password).then(function(){
                //Após criar o usuário vou atualizar ele para que o mesmo receba um nome
                var auth2 = $firebaseAuth();
                auth2.$signInWithEmailAndPassword(useremail, password);
                var user = auth2.$getAuth();

                console.log("Account created successfully!");
                
                //var firebaseObj = new Firebase("testeangularjs-d6b6f/users"+user.uid);
                //var newUser = $firebase(firebaseObj);

                var usersRef = firebase.database().ref().child('users/'+user.uid);

                usersRef.set({                    
                    username: username,
                    email: useremail});


                $location.path('/login');
                alert("Account created successfully!");
                $scope.errMsg = false;   

            }).catch(function(error){
                $scope.errMsg = true;
                $scope.errorMessage = error.message;
            });
        }
    }
}]);