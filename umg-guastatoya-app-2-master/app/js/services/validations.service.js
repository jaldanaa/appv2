(function () {
    'use strict';
    angular.module('UniversidadApp')
        .service('ValidationsService', ValidationsService);
    
    ValidationsService.$inject = [];

    function ValidationsService() {
        var service = this;

        return service;


    }

})();