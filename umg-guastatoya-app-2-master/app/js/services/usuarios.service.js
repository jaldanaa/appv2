(function () {
    'use strict';
    angular.module('UniversidadApp')
        .service('UsuariosService', UsuariosService);
    
    UsuariosService.$inject = ['UsuariosRepository', '$filter', '$state'];

    function UsuariosService(UsuariosRepository, $filter, $state) {
        var service = this;

        var service = {
            getUsuarios: getUsuarios,
            editarUsuario: editarUsuario,
            crearUsuario: crearUsuario,
            eliminarUsuario: eliminarUsuario,
            getUserType: getUserType,
            getUsuario: getUsuario,
            getUserData: getUserData,
            editarPerfil: editarPerfil,
            usuarios: []
        };

        return service;

        // Retorna un objeto con los campos que pertenecen al modelo User de django
        function getUserData(userModel) {
            var data = {};
            Object.entries(userModel).forEach(([key, value]) => {
                if (key != 'profile') {
                    data[key] = value;
                }
            });
            return data;
        }

        // Devuelve el nombre del itpo de administrador
        function getUserType(typeId) {
            switch (typeId) {
                case 1:
                    return 'Administrador';
                case 2:
                    return 'Profesor';
                case 3:
                    return 'Estudiante';
                case 4:
                    return 'Publicador';
                default:
                    break;
            }
        }

        // Devuelve todos los usuarios
        function getUsuarios() {
            return UsuariosRepository.getUsuarios().then(function(response) {
                service.usuarios = response.data;
                return service.usuarios;
            }).catch(handleError);
        }

        // Obtiene un usuario en especifico por id
        function getUsuario(id) {
            return UsuariosRepository.getUsuario(id).then(function(response) {
                return response.data;
            }).catch(handleError);
        }

        function editarUsuario(id, data) {
            return UsuariosRepository.editarUsuario(id, data).then(function(response) {
                return response;
            }).catch(handleError);
        }

        function editarPerfil(id, data) {
            return UsuariosRepository.editarPerfil(id, data).then(function(response) {
                return response;
            }).catch(handleError);
        }

        function crearUsuario(data) {
            return UsuariosRepository.crearUsuario(data).then(function(response) {
                return response;
            }).catch(handleError);
        }

        function eliminarUsuario(id) {
            return UsuariosRepository.eliminarUsuario(id).then(function(response) {
                removerUsuario(id);
                return response;
            }).catch(handleError);
        }

        // Quita un usuario del array que se usa prara mostrar los usuarios en el frontend
        function removerUsuario(usuarioId) {
            service.usuarios = $filter('filter')(service.usuarios, function (usuario) {
                return usuario.id != usuarioId;
            });
        }

        // Funcion que se usa para manejar los errores de los endpoints de usuarios, si devuelve 403 (forbidden) significa que no tiene acceso al endpoint y se redirige al inicio
        function handleError(error) {
            if (error.status === 403) {
                $state.go('noticias', {});
            }
            return error;
        }
        
    }

})();