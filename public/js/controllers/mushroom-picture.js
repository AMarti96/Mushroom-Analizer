'use strict';
var app =  angular.module('mainApp');
    app.controller('PictureCtrl',  ['$http', '$rootScope', '$scope','$window', function ($http, $rootScope, $scope, $window) {
        $rootScope.navbarActive = "predict";
        $scope.disableTrain = false;
        $scope.myCanvas2 = function () {
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            var img = document.getElementById("image");
            ctx.drawImage(img,0,0);
            /*var img = new Image;
            img.onload = function () {
                ctx.drawImage(img,0,0);
            };
            img.src = $scope.file;*/

            var data = {
                cabeza : ctx.getImageData(121,9,1,1).data,
                lamina : ctx.getImageData(121,45,1,1).data,
                Aanillo : ctx.getImageData(121,45,1,1).data,
                Danillo : ctx.getImageData(121,116,1,1).data,
                token : "token"
            };
            var req = {
                method: 'POST',
                url: '/predictImage',
                headers: {'Content-Type': 'application/json'},
                data: data
            };
            $http(req).then(function (response) {

                if (response.data === "edible"){
                    $window.location.href = '#!/edible';
                }
                else{
                    $window.location.href = '#!/poisonous';
                }
            });
        }

    }]);
