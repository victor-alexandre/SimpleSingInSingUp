'use strict';

angular.module('myApp.profile', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/profile', {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileCtrl'
    });
}])

.controller('ProfileCtrl', ['$scope', '$firebaseAuth', '$firebaseStorage', function($scope, $firebaseAuth, $firebaseStorage) {
    window.MY_SCOPE = $scope; 

    var linkDefaultImg = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

    

    var auth = $firebaseAuth();
    var user = auth.$getAuth();
    var userUID = firebase.auth().currentUser.uid;
    $scope.useremail = user.email;

    var profileEmail = user.email;
    var profileUsername;

    firebase.database().ref( '/users/' + userUID).once('value').then(function(snapshot) {
        var temp = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        console.log("chegou aqui: " + temp);
        $scope.username = temp;
        profileUsername = temp;   

        if(snapshot.val().profileURL){
            $scope.img = snapshot.val().profileURL;
        }
        else{
            $scope.img = linkDefaultImg;
        }

        // Força a atualização das variáveis do escopo
        $scope.$digest();   


    });

    var lastChoosenFile;

  // start Picture Preview    
    $scope.imageUpload = function (event) {
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
            console.log("O conteúdo do file " + i + " é" + file);
        }
        lastChoosenFile = file;
    }

    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.img = e.target.result; 
            console.log($scope.img);           
        });
    }


    $scope.uploadProfilePic = function (){
        // Create a Firebase Storage reference
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var profileRef = storageRef.child('ProfilePics/'+userUID);

        //Só vou upar se o conteúdo da imagem não for o link default e se o ultimo arquivo, que é a imagem mostrada no preview, não for nula.
        if($scope.img !== linkDefaultImg && lastChoosenFile != null){

            console.log("tentando uploadar" + $scope.img);
            var uploadTask = $firebaseStorage(profileRef).$put(lastChoosenFile);
                console.log("Upload Feito com sucesso");
/*
                //tentando escrever o url da imagem upada no realtime database
                task.snapshotChanges().pipe(
                finalize(() => {
                    profileRef.getDownloadURL().then((url) => {
                    var profileURL = url;

                    var usersRef = firebase.database().ref().child('users/'+userUID);
                    usersRef.set({                    
                        profileURL: profileURL); 
                    console.log( profileURL) 
                    });
                }))
*/ 
            
            uploadTask.$complete(function(snapshot) {
                console.log(snapshot.downloadURL);
                var usersRef = firebase.database().ref().child('users/'+userUID);
                usersRef.set({
                    username: profileUsername,
                    email: profileEmail,
                    profileURL: snapshot.downloadURL});
            });

/*
            $firebaseStorage(profileRef).$getDownloadURL().then(function(url) {
                var usersRef = firebase.database().ref().child('users/'+userUID);
                usersRef.set({
                    username: profileUsername,
                    email: profileEmail,
                    profileURL: url});                     
                console.log(url); 
            });
*/



        }
    }


    console.log(user.email);
}]);