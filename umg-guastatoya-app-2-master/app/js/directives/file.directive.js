// Directiva que sirve para cargar imagenes y que puedan ser enviadas por ajax
(function () {
    'use strict';

    angular.module('UniversidadApp')
        .directive('file', function () {
            return {
                scope: {
                    file: '='
                },
                link: function (scope, el, attrs) {
                    el.bind('change', function (event) {
                        var file = event.target.files[0];
                        scope.file = file ? file : undefined;
                        scope.$apply();
                    });
                }
            };
        })
})();