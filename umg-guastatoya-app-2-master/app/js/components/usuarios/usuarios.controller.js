(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('usuariosController', usuariosController)
        .component('usuarios', {
            templateUrl: [function () {
                return 'js/components/usuarios/usuarios.html';
            }],
            controller: 'usuariosController',
            controllerAs: 'vm', //View Model
            bindings: {
                usuarios: '<'
            }
        });
    
    usuariosController.$inject = ['AuthenticationService', 'UsuariosService', '$state'];

    function usuariosController(authenticationService, usuariosService, $state) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            vm.authenticationService = authenticationService;
            vm.usuariosService = usuariosService;
            
            vm.editarUsuario = editarUsuario;
            vm.eliminarUsuario = eliminarUsuario;
        }

        function editarUsuario(usuarioId) {
            $state.go('usuario', {id: usuarioId});
        }

        function eliminarUsuario(id) {
            if (!confirm('Eliminar este usario?')) {
                return;
            }
            usuariosService.eliminarUsuario(id).then(function(response) {
                if (response.status === 204) {
                    vm.usuarios = usuariosService.usuarios;
                    alert('Usuario elminado con exito')
                }
            }).catch(function(error) {
                console.log(error);
            })
        }
    }

})();