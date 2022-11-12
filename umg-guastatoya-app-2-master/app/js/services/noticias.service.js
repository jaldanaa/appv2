(function () {
    'use strict';
    angular.module('UniversidadApp')
        .service('NoticiasService', NoticiasService);
    
    NoticiasService.$inject = ['NoticiasRepository', '$filter'];

    function NoticiasService(noticiasRepository, $filter) {
        var service = this;

        service.getNoticias = getNoticias;
        service.getClasificaciones = getClasificaciones;
        service.getNoticia = getNoticia;
        service.getFormData = getFormData;
        service.eliminarNoticia = eliminarNoticia;
        service.buscarNoticias = buscarNoticias;
        service.getNoticiaTitulo = getNoticiaTitulo;
        service.noticias = [];
        service.nextPage = null;
        service.clasificaciones = [];
        service.blockingScroll = false;
        service.tituloNoticias = 'Publicaciones recientes';

        return service;

        function getNoticiaTitulo(titulo) {
            return titulo.split(' ').join('-');
        }

        // Maneja el comportamiento de la paginacion, recibe el response del backend y una flag para determinar si esta buscando o esta scrolleando
        function handlePagination(response, isSearch) {
            service.nextPage = response.next; // Almacena la url de la siguiente pagina devuelta por el backend
            if (service.noticias.length > 0 && !isSearch) { // si ya se ha cargado al menos una pagina y no se esta realizando una busqueda
                service.noticias = service.noticias.concat(response.results); // se agregan los nuevos resultados al listado actual de noticias
            } else {
                service.noticias = response.results; // Se inicializa el listado de noticias a la respuesta del backend
            }
        }

        // Obtiene un listado de noticias paginadas, de los parametros el mas importante es limit, 
        // se usa para indicar si se quiere limitar el numero de noticias que se quiere obtener
        // en nuestro caso lo usamos en la pagina de inicio el cual se limita a 4 noticias
        function getNoticias(clasificacionId, tituloNoticias, limit) {
            return noticiasRepository.getNoticias(clasificacionId, limit, service.nextPage).then(function (response) {
                service.tituloNoticias = tituloNoticias;
                handlePagination(response.data, false); // Se llama la funcion para manejar la paginacion
                service.blockingScroll = false; // Se desbloquea el scrolling que se detecta en el binding que hace la llamada al llegar al fondo de la pagina
                return service.noticias; // se retornan las noticias que se encuentran
            }).catch(function (error) {
                return error;
            })
        }

        // Hace una peticion pasando un parametro de busqueda por titulo
        function buscarNoticias(criterio) {
            return noticiasRepository.buscarNoticias(criterio).then(function (response) {
                handlePagination(response.data, true); // Se maneja la paginacion de los resultados obtenidos
                return service.noticias;
            }).catch(function (error) {
                return error;
            })
        }

        // Obtiene una noticia por su id
        function getNoticia(noticiaId) {
            return noticiasRepository.getNoticia(noticiaId).then(function (response) {
                service.noticias = [response.data]; // Se inicializa el servicio de noticias que se renderiza al resultado obtenido
                return response.data;
            }).catch(function (error) {
                return error;
            })
        }

        // Obtiene las clasificaciones
        function getClasificaciones() {
            return noticiasRepository.getClasificaciones().then(function (response) {
                service.clasificaciones = response.data;
                return service.clasificaciones;
            }).catch(function (error) {
                return error;
            })
        }

        // Elimina una noticia por su id
        function eliminarNoticia(noticiaId) {
            return noticiasRepository.eliminarNoticia(noticiaId).then(function (response) {
                removerNoticia(noticiaId); // Funcion que remueve la noticia eliminada del servicio de noticias que se renderiza en el frontend
                return response.status;
            }).catch(function(error) {
                return error;
            })
        }

        function removerNoticia(noticiaId) {
            service.noticias = $filter('filter')(service.noticias, function (noticia) {
                return noticia.id != noticiaId;
            });
        }

        // Funcion que arma un formdata para que este pueda ser enviado a travez de la peticion ajax incluyendo la imagen
        function getFormData(model, autorId) {
            var formData = new FormData();
            formData.append('titulo', model.titulo);
            formData.append('contenido', model.contenido);
            formData.append('clasificacion', model.clasificacion);
            formData.append('autor', model.autor);
            // Attach file
            model.imagen ? formData.append('imagen', model.imagen) : false;
            
            return formData;
        }

    }

})();