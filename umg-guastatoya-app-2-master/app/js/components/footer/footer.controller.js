(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('footerController', footerController)
        .component('footerComponent', {
            templateUrl: [function () {
                return 'js/components/footer/footer.html';
            }],
            controller: 'footerController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<'
            }
        });
    
    footerController.$inject = [];

    function footerController() {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
        }

    }

})();