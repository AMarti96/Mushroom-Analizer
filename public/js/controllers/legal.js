'use strict';
var app =  angular.module('mainApp');
    app.controller('LegalCtrl', ['$scope', '$rootScope',function ($scope, $rootScope) {
        $rootScope.navbarActive = "leg";
        $scope.disableTrain = false;


    }]);
