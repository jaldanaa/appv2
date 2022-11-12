(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('noticiaDetalleController', noticiaDetalleController)
        .component('noticiaDetalle', {
            templateUrl: [function () {
                return 'js/components/noticiaDetalle/noticiaDetalle.html';
            }],
            controller: 'noticiaDetalleController',
            controllerAs: 'vm', //View Model
            bindings: {
                noticia: '<' // resolve opcional que contendra la noticia si se esta editando, si se esta creando, este vendra indefinido
            }
        });
    
    noticiaDetalleController.$inject = ['AuthenticationService', 'NoticiasService', '$q', '$scope', 'apiUrl', '$window', '$stateParams'];

    function noticiaDetalleController(authenticationService, noticiasService, $q, $scope, apiUrl, $window, $stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            vm.authenticationService = authenticationService;
            vm.noticiasService = noticiasService;
        }

    }

})();