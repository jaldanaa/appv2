(function () {
    'use strict';

    angular.module('UniversidadApp')
        .factory('NoticiasRepository', NoticiasRepository);

    NoticiasRepository.$inject = ['$http', '$q', 'apiUrl', 'AuthenticationService'];

    function NoticiasRepository($http, $q, apiUrl, authenticationService) {
        var repository = {
            getNoticias: getNoticias,
            getClasificaciones: getClasificaciones,
            getNoticia: getNoticia,
            eliminarNoticia: eliminarNoticia,
            buscarNoticias: buscarNoticias
        };

        return repository;

        function getHeaders() {
            if (authenticationService.validSession()) {
                return {
                    Authorization: 'Bearer ' + authenticationService.sessionData.access
                };
            }else{
                return {};
            }
        }

        function getNoticias(clasificacionId, limit, nextPage) {
            var url = apiUrl + 'publicaciones?';
            clasificacionId ? url += '&clasificacion_id=' + clasificacionId : '';
            limit ? url += '&limit=' + limit : '';
            nextPage ? url = nextPage : false;
            return $http({
                method: 'GET',
                url: url,
                headers: getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function buscarNoticias(criterio) {
            return $http({
                method: 'GET',
                url: apiUrl + 'publicaciones?titulo__icontains=' + criterio,
                headers: getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function getNoticia(noticiaId) {
            return $http({
                method: 'GET',
                url: apiUrl + 'publicaciones/' + noticiaId,
                headers: getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function getClasificaciones() {
            return $http({
                method: 'GET',
                url: apiUrl + 'clasificaciones/',
                headers: getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function eliminarNoticia(noticiaId) {
            return $http({
                method: 'DELETE',
                url: apiUrl + 'publicaciones/' + noticiaId + '/',
                headers: getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function error(response) {
            authenticationService.verifyErrorType(response.data)
            return $q.reject(response);
        }

    }

})();