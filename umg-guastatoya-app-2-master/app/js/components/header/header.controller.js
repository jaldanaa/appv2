(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('headerController', headerController)
        .component('headerComponent', {
            templateUrl: [function () {
                return 'js/components/header/header.html';
            }],
            controller: 'headerController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<', // se usa para verificar que contenido se debe mostrar dependiendo desde que componente se renderiza el header
                noticiaDetalle: '<'
            }
        });
    
    headerController.$inject = ['AuthenticationService'];

    function headerController(authenticationService) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            vm.authenticationService = authenticationService;
        }
    }

})();