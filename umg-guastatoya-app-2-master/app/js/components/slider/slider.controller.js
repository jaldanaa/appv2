(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('sliderController', sliderController)
        .component('slider', {
            templateUrl: [function () {
                return 'js/components/slider/slider.html';
            }],
            controller: 'sliderController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<'
            }
        });
    
    sliderController.$inject = [];

    function sliderController() {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
        }

    }

})();