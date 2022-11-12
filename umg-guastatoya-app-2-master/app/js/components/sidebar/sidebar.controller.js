(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('sidebarController', sidebarController)
        .component('sidebar', {
            templateUrl: [function () {
                return 'js/components/sidebar/sidebar.html';
            }],
            controller: 'sidebarController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<', // binding para verificar que contenido se debe mostrar
                onSearchNews: '<', // binding que recibe la funcion que se debe ejecutar, este pertenece al controlador del componente donde se este renderizando
                criterioBusqueda: '=', //binding de doble direccion, el cual permite obtener el criterio de busqueda desde un input de este componente y pasarlo al componente padre: mas info buscar como TWO WAY BINDING
                hideSidebar: '<'
            }
        });
    
    sidebarController.$inject = ['NoticiasService', 'AuthenticationService', '$q'];

    function sidebarController(noticiasService, authenticationService, $q) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
            vm.authenticationService = authenticationService;
            vm.noticiasService = noticiasService;
            vm.filtrarNoticias = filtrarNoticias;
        }

        // Funcion que se llama al presionar el boton buscar en el sidebar
        function filtrarNoticias(clasificacionId, tituloNoticias) {
            noticiasService.getNoticias(clasificacionId, tituloNoticias).then(function(response) {
                vm.noticias = response;
            }).catch(function (error) {
                console.log(error);
            })
        }

    }

})();