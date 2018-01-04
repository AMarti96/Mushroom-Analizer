'use strict';
angular.module('mainApp')
    .controller('MushroomCtrl', ['$http', '$rootScope', '$scope','$window', function ($http, $rootScope, $scope, $window) {
        $rootScope.navbarActive = "predict";
        $scope.disableTrain = false;
        $scope.odor = "?";
        $scope.spore = "?";
        $scope.gill = "?";
        $scope.bruise = "?";
        $scope.surface = "?";
        $scope.odors = [
                "pungent",
                "almond",
                "anise",
                "none",
                "foul",
                "creosote",
                "fishy",
                "spicy",
                "musty"
            ];
        $scope.spores = [
            "black",
            "brown",
            "purple",
            "chocolate",
            "white",
            "green",
            "orange",
            "yellow",
            "buff"
        ];
        $scope.gills = [
            "narrow",
            "broad"
        ];
        $scope.bruises = [
            "bruises",
            "no"
        ];
        $scope.surfaces = [
            "smooth",
            "fibrous",
            "scaly",
            "silky"
        ];

        $scope.predict = function () {

            var data = {
                odor: $scope.odor,
                spore: $scope.spore,
                gill: $scope.gill,
                bruise: $scope.bruise,
                surface: $scope.surface,
                token: $scope.odor+$scope.spore+$scope.gill+$scope.bruise+$scope.surface
            }

            var req = {
                method: 'POST',
                url: '/predict',
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
