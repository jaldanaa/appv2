(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('noticiaFormController', noticiaFormController)
        .component('noticiaForm', {
            templateUrl: [function () {
                return 'js/components/noticiaForm/noticiaForm.html';
            }],
            controller: 'noticiaFormController',
            controllerAs: 'vm', //View Model
            bindings: {
                noticia: '<' // resolve opcional que contendra la noticia si se esta editando, si se esta creando, este vendra indefinido
            }
        });
    
    noticiaFormController.$inject = ['AuthenticationService', 'NoticiasService', '$q', '$scope', 'apiUrl', '$window', '$stateParams'];

    function noticiaFormController(authenticationService, noticiasService, $q, $scope, apiUrl, $window, $stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            vm.authenticationService = authenticationService;
            vm.noticiasService = noticiasService;
            vm.guardarNoticia = guardarNoticia;
            initialLoad();
        }

        // Funcion para inicializar el modelo de la noticia
        function setInitialModel () {
            vm.noticiaModel = {
                titulo: '',
                contenido: '',
                clasificacion: null,
                imagen: null,
                autor: authenticationService.currentUser.id // por defecto, el autor sera la persona que esta logueada
            }
            if (vm.noticia) { // se inicializa el modelo de la noticia que se esta editando, si noticia esta definida
                vm.noticiaModel.titulo = vm.noticia.titulo;
                vm.noticiaModel.contenido = vm.noticia.contenido;
                vm.noticiaModel.clasificacion = vm.noticia.clasificacion.id;
                vm.noticiaModel.autor = vm.noticia.autor.id;
            }
        }

        // Funcion para inicializar los valores iniciales
        function initialLoad() {
            setInitialModel()
            var promises = [noticiasService.getClasificaciones()];
            $q.all(promises)
        }

        function guardarNoticia() {
            // Validar si el formulario es valido
            if (vm.noticiaForm.$invalid) {
                return;
            }
            vm.noticiaModel.imagen = $scope.file; // Se obtiene el archivo desde la directiva
            // Se definen los textos a mostrar dependiendo si se esta creando o editando
            var errorText = vm.noticia ? 'Error al editar la publicacion, intente de nuevo.' : 'Error al crear la publicacion, intente de nuevo.';
            var successText = vm.noticia ? 'Publicacion editada con exito.' : 'Publicacion creada con exito.';
            var autor = vm.noticia ? vm.noticia.autor : null;
            // Se llama un servicio para armar el form data que contendra el archivo (imagen)
            var formData = noticiasService.getFormData(vm.noticiaModel, autor);
            // Se define el metodo a realizar y la url
            var method = vm.noticia ? 'PATCH' : 'POST';
            var url = vm.noticia ? apiUrl + 'publicaciones/' + vm.noticia.id + '/' : apiUrl + 'publicaciones/';
            // Se hace la llamada al endpoint por ajax
            jQuery.ajax({
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                type: method,
                headers: {
                    Authorization: 'Bearer ' + authenticationService.sessionData.access
                },
                success: function(response){
                    if (response.id) {
                        alert(successText);
                        !vm.noticia ? $window.location.reload() : false;
                    }
                },
                error: function(error) {
                    alert(errorText);
                }
            });
        }
    }

})();