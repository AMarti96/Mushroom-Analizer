'use strict';
var app = angular.module('mainApp',
    ["ng","ngAnimate","ngAria","ngMaterial",'ngCookies','ngResource','ngRoute','ngSanitize','ngTouch','ui.bootstrap','ngFileUpload']);

app.config(['$routeProvider',function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'tpls/main.html',
                controller: 'MainCtrl'
            })
            .when('/mushroom-predict', {
                templateUrl: 'tpls/mushroom-predict.html',
                controller: 'MushroomCtrl'
            })
            .when('/mushroom-userfriendly', {
                templateUrl: 'tpls/mushroom-userfriendly.html',
                controller: 'MushroomUserCtrl'
            })
            .when('/mushroom-picture', {
                templateUrl: 'tpls/mushroom-picture.html',
                controller: 'PictureCtrl'
            })
            .when('/legal', {
                templateUrl: 'tpls/legal.html',
                controller: 'LegalCtrl'
            })
            .when('/edible', {
                templateUrl: 'tpls/edible.html'
            })
            .when('/poisonous', {
                templateUrl: 'tpls/poisonous.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
