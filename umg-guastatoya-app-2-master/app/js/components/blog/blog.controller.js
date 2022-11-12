(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('blogController', blogController)
        .component('blog', {
            templateUrl: [function () {
                return 'js/components/blog/blog.html';
            }],
            controller: 'blogController',
            controllerAs: 'vm', //View Model
            bindings: {
                content: '<'
            }
        });
    
    blogController.$inject = ['NoticiasService', 'AuthenticationService', '$q', '$state', '$window', '$stateParams'];

    function blogController(noticiasService, authenticationService, $q, $state, $window, $stateParams) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {

            // Servicios
            vm.authenticationService = authenticationService;
            vm.noticiasService = noticiasService;

            // Funciones
            vm.editarNoticia = editarNoticia;
            vm.eliminarNoticia = eliminarNoticia;
            vm.buscarNoticias = buscarNoticias;
            vm.abrirNoticia = abrirNoticia;

            // Valores
            vm.criterioBusqueda = '';

            // Funcion inicial
            initialLoad();
        }


        // Binding al evento scroll del navegador
        angular.element($window)
		.bind(
			"scroll",
 	 			function() {
                    
                    // Calcular altura actual de la pantalla
					var windowHeight = "innerHeight" in window ? window.innerHeight
                            : document.documentElement.offsetHeight;
                    
                    //  Instancia del body
                    var body = document.body, html = document.documentElement;
                    
                    // Altura del documento actual
					var docHeight = Math.max(body.scrollHeight,
							body.offsetHeight, html.clientHeight,
                            html.scrollHeight, html.offsetHeight);
                    
                    // Detectar el tope del navegador
                    var windowBottom = windowHeight + window.pageYOffset;
                    
                    // Validacion para detectar el tope inferior del navegador
					if (windowBottom >= docHeight) {
                        // Validar si existen mas paginas para cargar, esta url viene de BE, si hay, se haran peticiones a esa url y se sumaran los elementos al array actual de noticias
                        // Se agrega una flag para bloquear el scroll ya que en ocasiones puede hacer varias llamadas al llegar al fondo de la pantalla y se siguie scrolleando con el mouse
						if (noticiasService.nextPage && !noticiasService.blockingScroll) {
                            noticiasService.blockingScroll = true; // Se bloquea el scroll para evitar multiples llamadas y duplicar data
                            noticiasService.getNoticias(null, 'Publicaciones Recientes', null).then(angular.noop); // Se hace la peticion para obtener la siguiente pagina
                        }
					}
			});

        function initialLoad() {
            // Se incializan los valores
            noticiasService.nextPage = null;
            noticiasService.noticias = [];
            // Verificar si se esta realizando una busqueda, por lo tanto el parametro de busqueda vendra definido, por lo tanto viene de la pantalla inicio de la pagina publica
            if ($stateParams.search) {
                // Se inicializa el parametro de busqueda por el titulo de la noticia, se pueden encontrar varias noticias
                vm.criterioBusqueda = $stateParams.search;
                buscarNoticias(); // Se ejecuta la funcion para realizar la busqueda
            } else if ($stateParams.noticiaId) {
                // En este caso esta abriendo una noticia y se buscara esa noticia por id para que se muestre solo una
                noticiasService.getNoticia($stateParams.noticiaId).then(angular.noop);
            }
            else {
                // Si no se esta haciendo ninguna de las acciones anteriores se obtiene la primera pagina de las noticias
                var promises = [noticiasService.getNoticias(null, 'Publicaciones Recientes', null)];
                $q.all(promises); // Se ejecuta la promesa
            }
        }

        
        function buscarNoticias () {
            // se hace la peticion enviando el parametro de busqueda que tiene binding en el input del sidebar lateral
            noticiasService.buscarNoticias(vm.criterioBusqueda).then(angular.noop)
        }

        function editarNoticia (noticiaId) {
            // se hace redireccion hacia el formulario de noticia pasando como parametro de estado el id de la noticia que se quiere editar
            $state.go('noticia', {id: noticiaId});
        }

        function abrirNoticia (noticiaId, titulo) {
            // se hace redireccion hacia el detalle de la de noticia pasando como parametro de estado el id de la noticia que se quiere editar
            $state.go('noticiaDetalle', {id: noticiaId, titulo: noticiasService.getNoticiaTitulo(titulo)});
        }

        function eliminarNoticia (noticiaId) {
            // Validacion para confirmar la accion
            if (!confirm('Esta seguro que desea eliminar esta publicacion?')) {
                return;
            }
            // Si se confirma la eliminacion se hace la peticion hacia el endpoint para eliminar la noticia
            noticiasService.eliminarNoticia(noticiaId).then(function(response) {
                if (response === 204) {
                    alert('Publicacion Eliminada con exito');
                }
            }).catch(function (error) {
                console.log(error);
            })
        }

    }

})();