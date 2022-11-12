(function () {
    'use strict';

    angular.module('UniversidadApp')
        .config(config)
        .run(transitions);

    transitions.$inject = ['$transitions', '$state', '$window', 'ValidationsService', 'AuthenticationService'];

    function transitions($transitions, $state, $window, validationsService, authenticationService) {
        var targetState = {
            to: function (state) {
                    return state.name === 'noticia' 
                        || state.name === 'usuarios'
                        || state.name === 'usuario';
            }
        }

        $transitions.onStart(targetState, function(transition) {
            // If the user is logged in
            var targetState = transition._targetState._identifier;
            if (typeof(targetState) === "object") {
                targetState = targetState.name;
            }
            if (authenticationService.validSession()) {
                authenticationService.refreshSession().then(function(response) {
                    var allowAccess = authenticationService.verifyPermission(targetState, response.user.profile.tipo);
                    if (!allowAccess) {
                        $state.go('noticias', {});
                    }
                });
            } else {
                authenticationService.logout();
                return;
            }
        });

    }
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    
    function config($stateProvider, $urlRouterProvider) {
        var states = [];

        states.push({
            name: 'noticias',
            url: '/',
            component: 'noticias'
        });

        states.push({
            name: 'usuarios',
            url: '/usuarios',
            component: 'usuarios',
            resolve: {
                usuarios: function (UsuariosService) {
                    return UsuariosService.getUsuarios();
                }
            }
        });

        states.push({
            name: 'usuario',
            url: '/usuarios/:id',
            component: 'usuarioForm',
            params: {
                id: {type: 'int', value: null}
            },
            resolve: {
                usuario: function ($stateParams, UsuariosService) {
                    if ($stateParams.id) {
                        return UsuariosService.getUsuario($stateParams.id);
                    }
                }
            }
        });

        states.push({
            name: 'blog',
            url: '/blog',
            component: 'blog',
            params: {
                search: {type: 'string', value: ''},
                noticiaId: {type: 'int', value: null}
            }
        });

        states.push({
            name: 'nosotros',
            url: '/nosotros',
            component: 'nosotros'
        });

        states.push({
            name: 'noticia',
            url: '/noticia/:id',
            component: 'noticiaForm',
            params: {
                id: {type: 'int', value: null}
            },
            resolve: {
                noticia: function ($stateParams, NoticiasService) {
                    if ($stateParams.id) {
                        return NoticiasService.getNoticia($stateParams.id);
                    }
                }
            }
        });

        states.push({
            name: 'noticiaDetalle',
            url: '/noticia-detalle/:titulo/:id',
            component: 'noticiaDetalle',
            params: {
                id: {type: 'int', value: null},
                titulo: {type: 'string', value: null}
            },
            resolve: {
                noticia: function ($stateParams, NoticiasService) {
                    if ($stateParams.id) {
                        return NoticiasService.getNoticia($stateParams.id);
                    }
                }
            }
        });

        states.push({
            name: 'login',
            url: '/login',
            component: 'login'
        });

        states.push({
            name: 'notFound',
            url: 'pagina-no-encontrada/',
            component: 'notFound'
        })

        angular.forEach(states, function(state) {
            $stateProvider.state(state);
        });

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get('$state');
            $state.go('notFound', {});
        });

    }

})();