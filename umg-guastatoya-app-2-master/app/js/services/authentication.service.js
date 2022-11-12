(function () {
    'use strict';
    angular.module('UniversidadApp')
        .service('AuthenticationService', AuthenticationService);
    
    AuthenticationService.$inject = ['$window', 'AuthenticationRepository', '$state'];

    function AuthenticationService($window, AuthenticationRepository, $state) {
        var service = this;

        // Functions
        service.getSessionData = getSessionData;
        service.setSessionData = setSessionData;
        service.getToken = getToken;
        service.refreshSession = refreshSession;
        service.validSession = validSession;
        service.logout = logout;
        service.verifyErrorType = verifyErrorType;
        service.getHeaders = getHeaders;
        service.verifyPermission = verifyPermission;
        service.getCurrentUserType = getCurrentUserType;

        // Values
        service.currentUser = {};
        service.sessionData = getSessionData();

        return service;

        // Funcion que retorna true o false dependiendo si existen en local storage los tokens de autenticacion
        function validSession () {
            service.sessionData = getSessionData();
            return service.sessionData.access && service.sessionData.refresh;
        }

        // Funcion que setea los tokens en localStorage
        function setSessionData(data) {
            $window.localStorage.access = data.access;
            $window.localStorage.refresh = data.refresh;
        }

        // Funcion que devuelve un objeto con los tokens de autenticacion
        function getSessionData() {
            return {
                access: $window.localStorage.access,
                refresh: $window.localStorage.refresh,
            }
        }

        // Funcion que hace una llamada al Backend enviando las credenciales y como respuesta obtiene los tokens de autenticacion que seran almacenados en local storage
        function getToken(data) {
            return AuthenticationRepository.getToken(data).then(function (response) {
                var user = parseJwt(response.data.access);
                if (user.profile.tipo != 1 && user.profile.tipo != 4) { // Se verifica el tipo de usuario es administrador o publicador
                    response.status = 403; // Si no es ninguna de las anteriores, se cambia el response a 403 (forbidden)
                }else{
                    setSessionData(response.data); // Si es alguna de las permitidas, se setean las variables de sesion (tokens)
                }
                return response; // se devuelve la respuesta
            }).catch(function (error) {
                return error;
            })
        }

        // Funcion que verifica la validez del token de autenticacion
        function refreshSession() {
            var refreshData = {
                refresh: service.sessionData.refresh
            };
            return AuthenticationRepository.refreshToken(refreshData).then(function(response) {
                parseJwt(response.data.access); // Se parsea el token de autenticacion que trae info del user que pertenece el token
                return {
                    response: response,
                    user: service.currentUser
                };
            }).catch(verifyErrorType);
        }

        // Devuelve el tipo de usuario que esta logueado
        function getCurrentUserType () {
            var currentUser = parseJwt(service.sessionData.access);
            return currentUser.profile.tipo;
        }

        // En base a los estados que estan protegidos, se verifica si para ese estado, el usuario que intenta ingresar, tiene los permisos necesarios.
        function verifyPermission(targetState, userType) {
            switch (targetState) {
                case 'usuario':
                    if (userType === 1) 
                        return true;
                    return false;
                case 'usuarios':
                    if (userType === 1) 
                        return true;
                    return false;
                case 'noticia':
                    if (userType === 1 || userType === 4) 
                        return true;
                    return false;
                default:
                    return true
            }
        }

        // Funcion que valida si el token que se envia es invalido, llama el meotodo logout
        function verifyErrorType(error) {
            if (error.code === 'token_not_valid') {
                logout();
            }
        }

        // Elimina los tokens de autenticacion y redirige al inicio o seccion de noticias
        function logout() {
            $window.localStorage.removeItem('access');
            $window.localStorage.removeItem('refresh');
            $state.go('noticias', {}, {reload: true});
        }

        // Recibe el token de autenticacion y devuelve el user que viene hasheado en el token
        function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        
            var jwtPayload = JSON.parse(jsonPayload);
            service.currentUser = jwtPayload.user;
            return service.currentUser;
        }

        // Funcion que retorna los headers que son necesarios enviar en los repositorios en caso sean requeridos por el endpoint
        function getHeaders() {
            if (validSession()) {
                return {
                    Authorization: 'Bearer ' + service.sessionData.access
                };
            }else{
                return {};
            }
        }

    }

})();