(function () {
    'use strict';

    angular.module('UniversidadApp')
        .controller('usuarioFormController', usuarioFormController)
        .component('usuarioForm', {
            templateUrl: [function () {
                return 'js/components/usuarioForm/usuarioForm.html';
            }],
            controller: 'usuarioFormController',
            controllerAs: 'vm', //View Model
            bindings: {
                usuario: '<' // resolve que se envia desde el route en config y pasa el usuario que se este editando si asi fuera el caso
            }
        });
    
    usuarioFormController.$inject = ['AuthenticationService', 'UsuariosService', '$q', '$scope', 'apiUrl', '$window', '$stateParams'];

    function usuarioFormController(authenticationService, usuariosService, $q, $scope, apiUrl, $window, $stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            vm.authenticationService = authenticationService;
            vm.usuariosService = usuariosService;

            vm.isEditing = vm.usuario ? true : false; // se define una variable para saber si esta editando o esta creando un usuario nuevo
            
            vm.editarUsuario = editarUsuario;
            vm.setUserType = setUserType;
            vm.crearUsuario = crearUsuario;
            initialLoad();
        }

        // Se define el modelo inicial del usuario
        function setInitialModel () {
            vm.usuarioModel = {
                profile: {
                    tipo: 3,
                },
                last_login: '',
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                date_joined: ''
            }

            // Si se esta editando, se agrega al modelo usuario que esta relacionado con el html
            if (vm.usuario) {
                vm.usuarioModel = vm.usuario;
            }
            // Se setea el tipo de usuario 
            vm.userType = usuariosService.getUserType(vm.usuarioModel.profile.tipo);
        }

        function initialLoad() {
            setInitialModel();
        }

        // funcion que se sirve para desplegar el nombre correcto del tipo de usuario en el dropdown del formulario
        function setUserType (userType) {
            vm.usuarioModel.profile.tipo = userType;
            vm.userType = usuariosService.getUserType(userType);
        }

        function editarUsuario() {
            vm.usuarioForm.$submitted = true;
            if (vm.usuarioForm.$invalid) {
                return;
            }

            // Cuando se esta editando un usuario, se deben hacer dos peticiones, una para editar el modelo User de django y otr para editar el modelo Profile
            // el cual esta atado con una relacion uno a uno
            var promises = [
                usuariosService.editarUsuario(vm.usuarioModel.id, usuariosService.getUserData(vm.usuarioModel)),
                usuariosService.editarPerfil(vm.usuarioModel.profile.id, vm.usuarioModel.profile)
            ];
            $q.all(promises).then(function (response) {
                if (response[0].status === 200 && response[1].status === 200) {
                    alert('Los datos del usuario se han editado con exito');
                }else{
                    alert('Error al editar el usuario, intente nuevamente');
                }
            }).catch(function(error) {
                console.log(error);
                alert('Error de servidor, intente mas tarde');
            });
        }

        function crearUsuario() {
            vm.usuarioForm.$submitted = true;
            if (vm.usuarioForm.$invalid) {
                return;
            }
            // Al crear un usuario, se llama un servicio para estructurar el payload tal como lo requirere el endpoint sin incluir los campos extras que pertenecen al profile
            var newUserData = usuariosService.getUserData(vm.usuarioModel);

            // Se define el timestamp en que se crea el usuario
            newUserData.date_joined = moment().format('YYYY-MM-DDThh:mm:ss');
            newUserData.last_login = null; // ultima vez que se loguea es nulo ya que es usuario nuevo
            newUserData.password = vm.usuarioModel.profile.raw_password; // se hace una copia del password en el modelo profile para poder leerlo despues, ya que django por defecto lo hashea antes de guardarlo en base de datos
            usuariosService.crearUsuario(newUserData).then(function (response) {
                if (response.status === 201) { // Primero se crea el usuario en el modelo User de django, a su vez este automaticamente le creara un profile con el mismo id del usuario recien creado
                    vm.usuarioModel.profile.id = response.data.id;
                    // Se hace una peticion para editar el perfil del nuevo usuario y sincronizar su data, que seria su tipo de usuario y su password
                    usuariosService.editarPerfil(response.data.id, vm.usuarioModel.profile).then(function(response) { 
                        if (response.status === 200) {
                            alert('Usuario creado con exito');
                            location.reload();
                        }
                    });
                }
            }).catch(function(error) {
                console.log(error);
                alert('Error de servidor, intente mas tarde');
            });
        }

    }

})();