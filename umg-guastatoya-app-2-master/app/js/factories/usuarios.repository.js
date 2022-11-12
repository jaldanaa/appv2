(function () {
    'use strict';

    angular.module('UniversidadApp')
        .factory('UsuariosRepository', UsuariosRepository);

    UsuariosRepository.$inject = ['$http', '$q', 'apiUrl', 'AuthenticationService'];

    function UsuariosRepository($http, $q, apiUrl, authenticationService) {
        var repository = {
            getUsuarios: getUsuarios,
            editarUsuario: editarUsuario,
            crearUsuario: crearUsuario,
            eliminarUsuario: eliminarUsuario,
            getUsuario: getUsuario,
            editarPerfil: editarPerfil
        };

        return repository;

        function getUsuarios() {
            return $http({
                method: 'GET',
                url: apiUrl + 'users/',
                headers: authenticationService.getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function getUsuario(id) {
            return $http({
                method: 'GET',
                url: apiUrl + 'users/' + id + '/',
                headers: authenticationService.getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function editarUsuario(id, data) {
            return $http({
                method: 'PATCH',
                url: apiUrl + 'users/' + id + '/',
                data: data,
                headers: authenticationService.getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function editarPerfil(id, data) {
            return $http({
                method: 'PATCH',
                url: apiUrl + 'profiles/' + id + '/',
                data: data,
                headers: authenticationService.getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function crearUsuario(data) {
            return $http({
                method: 'POST',
                url: apiUrl + 'users/',
                data: data,
                headers: authenticationService.getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function eliminarUsuario(id) {
            return $http({
                method: 'DELETE',
                url: apiUrl + 'users/' + id + '/',
                headers: authenticationService.getHeaders()
            }).then(function (response) {
                return response;
            }).catch(error);
        }

        function error(response) {
            return $q.reject(response);
        }

    }

})();