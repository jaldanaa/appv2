(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('notFoundController', notFoundController)
        .component('notFound', {
            templateUrl: [function () {
                return 'js/components/notFound/notFound.html';
            }],
            controller: 'notFoundController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<'
            }
        });
    
    notFoundController.$inject = ['AuthenticationService'];

    function notFoundController(authenticationService) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
            vm.authenticationService = authenticationService;
        }

    }

})();