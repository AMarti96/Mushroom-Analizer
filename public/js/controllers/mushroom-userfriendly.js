'use strict';
angular.module('mainApp')
    .controller('MushroomUserCtrl', ['$http', '$rootScope', '$scope','$window', function ($http, $rootScope, $scope, $window) {
        $rootScope.navbarActive = "predict";
        $scope.disableTrain = false;
        $scope.capSurface = "?";
        $scope.capColor = "?";
        $scope.bruise = "?";
        $scope.gillSize = "?";
        $scope.gillColor = "?";
        $scope.stalkShape = "?";
        $scope.stalkRoot = "?";
        $scope.ringType = "?";
        $scope.population = "?";
        $scope.habitat = "?";

        $scope.capSurfaces = [
            "smooth","scaly","fibrous","grooves"
        ];
        $scope.capColors = [
            "brown","yellow","white","gray","red","pink","buff","purple","cinnamon","green"
        ];
        $scope.gillSizes = [
            "narrow",
            "broad"
        ];
        $scope.gillColors = [
            "black","brown","gray","pink","white","chocolate","purple","red","buff","green","yellow","orange"
        ];
        $scope.stalkShapes = [
            "enlarging","tapering"
        ];
        $scope.stalkRoots = [
            "equal","club","bulbous","rooted"
        ];
        $scope.ringTypes = [
            "pendant","evanescent","large","flaring","none"
        ];
        $scope.populations = [
            "scattered","numerous","abundant","several","solitary","clustered"
        ];
        $scope.habitats = [
            "urban","grasses","meadows","woods","paths","waste","leaves"
        ];
        $scope.bruises = [
            "bruises",
            "no"
        ];
        $scope.predict = function () {

            var data = {
                capSurface: $scope.capSurface,
                capColor: $scope.capColor,
                bruise: $scope.bruise,
                gillSize: $scope.gillSize,
                gillColor: $scope.gillColor,
                stalkShape: $scope.stalkShape,
                stalkRoot: $scope.stalkRoot,
                ringType: $scope.ringType,
                population: $scope.population,
                habitat: $scope.habitat,
                token: $scope.capSurface+$scope.capColor+$scope.bruise+$scope.gillSize+$scope.gillColor+$scope.stalkShape+$scope.stalkRoot+$scope.ringType+$scope.population+$scope.habitat
            }

            var req = {
                method: 'POST',
                url: '/predictFriendly',
                headers: {'Content-Type': 'application/json'},
                data: data
            };
            $http(req).then(function (response) {

                console.log(response.data)

                if (response.data === "edible"){
                    $window.location.href = '#!/edible';
                }
                else{
                    $window.location.href = '#!/poisonous';
                }

            });

        }



    }]);
