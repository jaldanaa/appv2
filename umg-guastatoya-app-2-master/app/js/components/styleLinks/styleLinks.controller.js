(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('styleLinksController', styleLinksController)
        .component('styleLinks', {
            templateUrl: [function () {
                return 'js/components/styleLinks/styleLinks.html';
            }],
            controller: 'styleLinksController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<'
            }
        });
    
    styleLinksController.$inject = ['AuthenticationService'];

    function styleLinksController(authenticationService) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
            vm.authenticationService = authenticationService;
        }

    }

})();