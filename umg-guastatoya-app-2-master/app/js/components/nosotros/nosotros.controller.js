(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('nosotrosController', nosotrosController)
        .component('nosotros', {
            templateUrl: [function () {
                return 'js/components/nosotros/nosotros.html';
            }],
            controller: 'nosotrosController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<'
            }
        });
    
    nosotrosController.$inject = [];

    function nosotrosController() {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
        }

    }

})();