(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('noticiasController', noticiasController)
        .component('noticias', {
            templateUrl: [function () {
                return 'js/components/noticias/noticias.html';
            }],
            controller: 'noticiasController',
            controllerAs: 'vm', //View Model
            bindings: {}
        });
    
    noticiasController.$inject = ['NoticiasService', 'AuthenticationService', '$q', '$state', '$window']; // inyeccion de servicios y dependencias

    function noticiasController(noticiasService, authenticationService, $q, $state, $window) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
            vm.authenticationService = authenticationService;
            vm.noticiasService = noticiasService;
            vm.editarNoticia = editarNoticia;
            vm.eliminarNoticia = eliminarNoticia;
            vm.buscarNoticias = buscarNoticias;
            vm.abrirPublicacion = abrirPublicacion;

            vm.criterioBusqueda = '';
            initialLoad();
        }

        // mismo componente utilizado en blog para detectar el scroll
        angular.element($window)
		.bind(
			"scroll",
 	 			function() {
                      
					var windowHeight = "innerHeight" in window ? window.innerHeight
							: document.documentElement.offsetHeight;
					var body = document.body, html = document.documentElement;
					var docHeight = Math.max(body.scrollHeight,
							body.offsetHeight, html.clientHeight,
							html.scrollHeight, html.offsetHeight);
					var windowBottom = windowHeight + window.pageYOffset;
					if (windowBottom >= docHeight) {
                        // Al llegar al tope inferior de la pantalla se valida
                        // que exista una pagina siguiente, que se encuentre en el administrador, ya que en la pagina publica solo se muestran los ultimos 4 elementos
                        // se verifica que el scroll no este bloqueado
						if (noticiasService.nextPage && authenticationService.validSession() && !noticiasService.blockingScroll) {
                            noticiasService.blockingScroll = true; // Se bloquea el scroll para evitar multiples llamadas
                            noticiasService.getNoticias(null, 'Publicaciones Recientes', null).then(angular.noop); // se hace la peticion para obtener la pagina correspondiente de noticias
                        }
					}
			});

        function initialLoad() {
            // Se incializan los valores
            noticiasService.nextPage = null;
            noticiasService.noticias = [];
            // si esta logueado en el administrador se hace una peticion para obtener la primera pagina de noticias
            if (authenticationService.validSession()) {
                noticiasService.getNoticias(null, 'Publicaciones Recientes', null).then(angular.noop);
            }else{ // Si no esta logueado, se obtiene unicamente los ultimos 4 elementos
                var promises = [noticiasService.getNoticias(null, 'Publicaciones Recientes', 4), noticiasService.getClasificaciones()];
                $q.all(promises);
            }
        }

        function abrirPublicacion(id, titulo) {
            // redireccion hacia el blog pasando como parametro el id de la publicacion que se quiere abrir
            $state.go('noticiaDetalle', {id: id, titulo: noticiasService.getNoticiaTitulo(titulo)});
        }

        function buscarNoticias () {
            // Si esta en el admin no se hace redireccion y se busca por el titulo de noticias y se muestran los resultados paginados
            if (authenticationService.validSession()) {
                noticiasService.buscarNoticias(vm.criterioBusqueda).then(angular.noop);
            }else{ // Si esta en la pagina publica se hace redireccion al blog pasando como parametro de estado el criterio de la busqueda
                $state.go('blog', {search: vm.criterioBusqueda});
            }
        }

        function editarNoticia (noticiaId) {
            // Redireccion al formulario de noticia
            $state.go('noticia', {id: noticiaId});
        }

        function eliminarNoticia (noticiaId) {
            if (!confirm('Esta seguro que desea eliminar esta publicacion?')) {
                return;
            }
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