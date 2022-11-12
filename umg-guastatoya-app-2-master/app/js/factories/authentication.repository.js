(function () {
    'use strict';

    angular.module('UniversidadApp')
        .factory('AuthenticationRepository', AuthenticationRepository);

    AuthenticationRepository.$inject = ['$http', '$q', 'apiUrl'];

    function AuthenticationRepository($http, $q, apiUrl) {
        var repository = {
            getToken: getToken,
            refreshToken: refreshToken
        };

        return repository;

        function getToken(data) {
            return $http({
                method: 'POST',
                url: apiUrl + 'token/',
                data: data
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function refreshToken(data) {
            return $http({
                method: 'POST',
                url: apiUrl + 'token/refresh/',
                data: data
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function error(response) {
            return $q.reject(response);
        }

    }

})();