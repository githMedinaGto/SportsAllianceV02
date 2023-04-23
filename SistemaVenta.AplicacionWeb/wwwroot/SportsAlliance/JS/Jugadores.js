var sImg;
var iIdJugador;

$(document).ready(function () {

    LlenarComboSeleEquipos();
    fn_limpiarCampos();
    $('.select2').select2({
        dropdownParent: $("#modalEquipos"),
        width: 'resolve',
        language: {

            noResults: function () {

                return "No hay resultado";
            },
            searching: function () {

                return "Buscando..";
            }
        }
    });


    $("#cboEquipos").change(function () {
        var idEqu = $("#cboEquipos").val()
        if (idEqu != 0 & idEqu != null) {
            fn_tabJugadores(idEqu);
        }
    });

    //Función del botón agregar Jugador
    $("#btnRegistrar").click(function () {
        fn_limpiarCampos();

        $('.select2').select2({
            dropdownParent: $("#modalNuevoJugador"),
            width: 'resolve',
            language: {

                noResults: function () {

                    return "No hay resultado";
                },
                searching: function () {

                    return "Buscando..";
                }
            }
        });
        document.getElementById('btnActualizarJugador').style.display = 'none';
        document.getElementById('btnGuardarJugador').style.display = 'block';
        $("#modalNuevoJugador").modal("show");
    });

    //Función del botón agregar Jugador
    $("#btnGuardarJugador").click(function () {
        fn_GuardarJugador();
    });

    //Función del botón Actualizar Jugador
    $("#btnActualizarJugador").click(function () {
        fn_ActualizarJugador();
    });

    //Función del botón Actualizar Jugador
    $("#btnDel").click(function () {
        fn_EliminarJugador();
    });

    $("#txtFecha").datepicker({
        prevText: '< Ant',
        nextText: 'Sig >',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: "yy-mm-dd",
        firstDay: 1,
        changeMonth: true,
        changeYear: true,
        autoOpen: false,
        autocomplete: false
    });

    //$.growl({ title: "Growl", message: "The kitten is awake!" });
    //$.growl.error({ message: "The kitten is attacking!" });
    //$.growl.notice({ message: "The kitten is cute!" });
    //$.growl.warning({ message: "The kitten is ugly!" });

});

function LlenarComboSeleEquipos() {

    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Jugadores/LlenarComboEquipos',
        type: 'POST',
        statusCode: {
            200: function (response) {
                $("#cboEquipos").html(response);
                $("#cboAdEquipos").html(response);
                $("#page-top").LoadingOverlay("hide");
            }
        },
        default: function () {
            $("#page-top").LoadingOverlay("hide");
            $.growl.error({ message: textStatus });
        }
    });
}

//Función que cambia la version del select a la 2
//para tener un campo de texto de busqueda
function fn_Select2(classId) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    $('.select2').select2({
        dropdownParent: $(classId),
        width: 'resolve',
        language: {

            noResults: function () {

                return "No hay resultado";
            },
            searching: function () {

                return "Buscando..";
            }
        }
    });
    //setTimeout($.unblockUI, 100);
}

function fn_tabJugadores(idEqu) { 
    $("#page-top").LoadingOverlay("show");
    $("#divTablaJugadores").html("");
    $.ajax({
        url: '/Jugadores/TablaJugadores',
        type: 'POST',
        data: {
            'idEquipo': idEqu
        },
        statusCode: {
            200: function (response) {
                if (response != "-1") {
                    if (response != "") {
                        $("#divTablaJugadores").html(response);
                        $('#tblJugadores').DataTable({
                            scrollX: true,
                            language: {
                                "decimal": "",
                                "emptyTable": "No hay información",
                                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                                "infoPostFix": "",
                                "thousands": ",",
                                "lengthMenu": "Mostrar _MENU_ Entradas",
                                "loadingRecords": "Cargando...",
                                "processing": "Procesando...",
                                "search": "Buscar:",
                                "zeroRecords": "Sin resultados encontrados",
                                "paginate": {
                                    "first": "Primero",
                                    "last": "Ultimo",
                                    "next": "Siguiente",
                                    "previous": "Anterior"
                                }
                            },
                            responsive: true,

                            //lengthMenu: [
                            //    [ 10, 20,50, -1],
                            //    [ 10, 50, 'Todos'],
                            //],
                        });
                        $("#page-top").LoadingOverlay("hide");
                    }
                    $("#page-top").LoadingOverlay("hide");
                }
                $("#page-top").LoadingOverlay("hide");
                $("#page-top").LoadingOverlay("hide");
            },
            default: function () {
                alertify.error("Error al generar la tabla");
                $("#page-top").LoadingOverlay("hide");
            }
        }
    });
}

function convertToBase64Img() {
    var archivo = document.getElementById("file").files[0];
    var reader = new FileReader();
    if (file) {

        reader.readAsDataURL(archivo);
        reader.onloadend = function () {
            myString = reader.result;
            document.getElementById("img").src = reader.result;
            sImg = reader.result;
            document.querySelector('#img').setAttribute('width', 200);
            document.querySelector('#img').setAttribute('height', 200);
        }
    }
}

function permite(elEvento, permitidos) {
    // Variables que definen los caracteres permitidos
    var numeros = "0123456789";
    var caracteres = " abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    var numeros_caracteres = numeros + caracteres;
    var teclas_especiales = [8, 37, 39, 46];
    // 8 = BackSpace, 46 = Supr, 37 = flecha izquierda, 39 = flecha derecha


    // Seleccionar los caracteres a partir del parámetro de la función
    switch (permitidos) {
        case 'num':
            permitidos = numeros;
            break;
        case 'car':
            permitidos = caracteres;
            break;
        case 'num_car':
            permitidos = numeros_caracteres;
            break;
    }

    // Obtener la tecla pulsada
    var evento = elEvento || window.event;
    var codigoCaracter = evento.charCode || evento.keyCode;
    var caracter = String.fromCharCode(codigoCaracter);

    // Comprobar si la tecla pulsada es alguna de las teclas especiales
    // (teclas de borrado y flechas horizontales)
    var tecla_especial = false;
    for (var i in teclas_especiales) {
        if (codigoCaracter == teclas_especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    // Comprobar si la tecla pulsada se encuentra en los caracteres permitidos
    // o si es una tecla especial
    return permitidos.indexOf(caracter) != -1 || tecla_especial;

    //    < !--Sólo números-- >
    //      <input type="text" id="texto" onkeypress="return permite(event, 'num')" />

    //    <!--Sólo letras-- >
    //      <input type="text" id="texto" onkeypress="return permite(event, 'car')" />

    //    <!--Sólo letras o números-- >
    //      <input type="text" id="texto" onkeypress="return permite(event, 'num_car')" />
}

function fn_GuardarJugador() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });

    $("#page-top").LoadingOverlay("show");
    var error = "";
    var sNomCom = "";
    var sEquipo = $("#cboAdEquipos").val();
    var sApodo = $("#txtApodo").val();
    var iDorsal = $("#txtDorsal").val();
    var sNombre = $("#txtNombre").val();
    var sApP = $("#txtApP").val();
    var sApM = $("#txtApM").val();
    var sFecha = $("#txtFecha").val();
    var sPosicion = $("#txtPosicion").val();

    if (sEquipo != "0" && sEquipo != undefined) {
        if (sApodo != "" && sApodo != undefined) {
            if (iDorsal != "" && iDorsal != undefined) {
                if (sNombre != "" && sNombre != undefined) {
                    if (sApP != "" && sApP != undefined) {
                        if (sFecha != "" && sFecha != undefined) {

                            if (sPosicion != "" && sPosicion != undefined) {
                                sNomCom = sNombre + " " + sApP + " " + sApM;
                                $.ajax({
                                    url: '/Jugadores/InsertarJugador',
                                    type: 'POST',
                                    data: {
                                        'sNombreCom': sNomCom,
                                        'sEquipo': sEquipo,
                                        'sApodo': sApodo,
                                        'iDorsal': iDorsal,
                                        'sFecha': sFecha,
                                        'sFoto': sImg,
                                        'sPosicion': sPosicion
                                    },
                                    statusCode: {
                                        200: function (response) {
                                            
                                            if (response == "1") {
                                                $.growl.error({ message: "El jugador ya existe" });
                                            } else if (response == "2") {
                                                $.growl.error({ message: "Error al insertar" });
                                            } else {
                                                $("#modalNuevoJugador").modal("hide");
                                                $.growl.notice({ message: "Jugador agregado" });
                                                fn_tabJugadores(sEquipo)
                                                fn_limpiarCampos();
                                            }
                                            $("#page-top").LoadingOverlay("hide");
                                        },
                                        default: function () {
                                            alertify.error("Error al generar la tabla");
                                            $("#page-top").LoadingOverlay("hide");
                                        }
                                    }
                                });
                            } else {
                                error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar una posición</span>';
                                $('#txtPosicion').after($(error).fadeOut(2000));
                            }

                        } else {
                            error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar la fecha</span>';
                            $('#txtFecha').after($(error).fadeOut(2000));
                        }
                    } else {
                        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el aapellido</span>';
                        $('#txtApP').after($(error).fadeOut(2000));
                    }
                } else {
                    error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el num dorsal</span>';
                    $('#txtNombre').after($(error).fadeOut(2000));
                }
            } else {
                error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el num dorsal</span>';
                $('#txtDorsal').after($(error).fadeOut(2000));
            }
        } else {
            error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el apodo</span>';
            $('#txtApodo').after($(error).fadeOut(2000));
        }
    } else {
        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de seleccionar un equipo</span>';
        $('#cboAdEquipos').after($(error).fadeOut(2000));
    }
    $("#page-top").LoadingOverlay("hide");
}

function fn_EditJugador(idJugador) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    //console.log(idJugador);
    $("#page-top").LoadingOverlay("show");
    const demoId = document.querySelector('#hTitulo');
    demoId.textContent = 'Editar Jugador';

    document.getElementById('btnActualizarJugador').style.display = 'block';
    document.getElementById('btnGuardarJugador').style.display = 'none';

    $.ajax({
        url: '/Jugadores/VerJugador',
        type: 'POST',
        data: {
            'idJugador': idJugador
        },
        statusCode: {
            200: function (response) {
                if (response.length != 0) {

                    iIdJugador = response[0];
                    sImg = response[6];
                        var arrayString = response[1].split(' ');
                        if (arrayString.length > 4) {
                            $("#txtNombre").val(arrayString[0] + " " + arrayString[1]);
                            $("#txtApP").val(arrayString[2]);
                            $("#txtApM").val(arrayString[3]);
                        } else if (arrayString.length = 3) {
                            $("#txtNombre").val(arrayString[0]);
                            $("#txtApP").val(arrayString[1]);
                            $("#txtApM").val(arrayString[2]);
                        } else if (arrayString.length < 3) {
                            $("#txtNombre").val(arrayString[0]);
                            $("#txtApP").val(arrayString[1]);
                        }

                        $("#cboAdEquipos").val(response[7]);
                        $("#txtApodo").val(response[2]);
                        $("#txtDorsal").val(response[5]);
                        var separators = ["/", " "];
                        var arrayDate = response[3].split(new RegExp(separators.join('|'), 'g'));

                        $("#txtFecha").val(arrayDate[2] + "-" + arrayDate[1] + "-" + arrayDate[0]);
                        $("#txtPosicion").val(response[4]);
                        document.getElementById("img").src = response[6];
                        document.querySelector('#img').setAttribute('width', 200);
                        document.querySelector('#img').setAttribute('height', 200);

                        $("#modalNuevoJugador").modal("show");
                    $("#page-top").LoadingOverlay("hide");
                    
                }
                $("#page-top").LoadingOverlay("hide");
            },
            default: function () {
                alertify.error("Error al generar la tabla");
                $("#page-top").LoadingOverlay("hide");
            }
        }
    });
}

function fn_ActualizarJugador() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    var error = "";
    var sNomCom = "";
    var sEquipo = $("#cboAdEquipos").val();
    var sApodo = $("#txtApodo").val();
    var iDorsal = $("#txtDorsal").val();
    var sNombre = $("#txtNombre").val();
    var sApP = $("#txtApP").val();
    var sApM = $("#txtApM").val();
    var sFecha = $("#txtFecha").val();
    var sPosicion = $("#txtPosicion").val();

    if (sEquipo != "0" && sEquipo != undefined) {
        if (sApodo != "" && sApodo != undefined) {
            if (iDorsal != "" && iDorsal != undefined) {
                if (sNombre != "" && sNombre != undefined) {
                    if (sApP != "" && sApP != undefined) {
                        if (sFecha != "" && sFecha != undefined) {

                            if (sPosicion != "" && sPosicion != undefined) {
                                sNomCom = sNombre + " " + sApP + " " + sApM;

                                //$.ajax({
                                //    url: "Jugadores.aspx/ActualizarJugador",
                                //    data: "{sNombreCom: '" + sNomCom + "', sEquipo: '" + sEquipo + "', sApodo: '" + sApodo + "', iDorsal: " + iDorsal + ", sFecha: '" + sFecha + "'," + "sFoto:'" + sImg + "', sPosicion: '" + sPosicion + "', iIdJugador: " + iIdJugador + "}",
                                //    dataType: "json",
                                //    type: "POST",
                                //    contentType: "application/json; charset=utf-8",
                                //    success: function (data) {
                                //        if (data.d == "1") {
                                //            $.growl.error({ message: "El jugador ya existe" });
                                //        } else if (data.d == "2") {
                                //            $.growl.error({ message: "Error al actualizar" });
                                //        } else {
                                //            $("#modalNuevoJugador").modal("hide");
                                //            $.growl.warning({ message: "Jugador actualizado" });
                                //            fn_tabJugadores(sEquipo)
                                //            fn_limpiarCampos();
                                //        }
                                //    },
                                //    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                //        setTimeout($.unblockUI, 100);
                                //        $.growl.error({ message: textStatus });
                                //    }
                                //});
                                $.ajax({
                                    url: '/Jugadores/ActualizarJugador',
                                    type: 'POST',
                                    data: {
                                        'sNombreCom': sNomCom,
                                        'sEquipo': sEquipo,
                                        'sApodo': sApodo,
                                        'iDorsal': iDorsal,
                                        'sFecha': sFecha,
                                        'sFoto': sImg,
                                        'sPosicion': sPosicion,
                                        'iIdJugador': iIdJugador 
                                    },
                                    statusCode: {
                                        200: function (response) {

                                            if (response == "1") {
                                                $.growl.error({ message: "El jugador ya existe" });
                                            } else if (response == "2") {
                                                $.growl.error({ message: "Error al insertar" });
                                            } else {
                                                $("#modalNuevoJugador").modal("hide");
                                                $.growl.notice({ message: "Jugador actualizado" });
                                                fn_tabJugadores(sEquipo)
                                                fn_limpiarCampos();
                                            }
                                            $("#page-top").LoadingOverlay("hide");
                                        },
                                        default: function () {
                                            alertify.error("Error al generar la tabla");
                                            $("#page-top").LoadingOverlay("hide");
                                        }
                                    }
                                });
                            } else {
                                error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar una posición</span>';
                                $('#txtPosicion').after($(error).fadeOut(2000));
                            }

                        } else {
                            error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar la fecha</span>';
                            $('#txtFecha').after($(error).fadeOut(2000));
                        }
                    } else {
                        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el aapellido</span>';
                        $('#txtApP').after($(error).fadeOut(2000));
                    }
                } else {
                    error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el num dorsal</span>';
                    $('#txtNombre').after($(error).fadeOut(2000));
                }
            } else {
                error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el num dorsal</span>';
                $('#txtDorsal').after($(error).fadeOut(2000));
            }
        } else {
            error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el apodo</span>';
            $('#txtApodo').after($(error).fadeOut(2000));
        }
    } else {
        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de seleccionar un equipo</span>';
        $('#cboAdEquipos').after($(error).fadeOut(2000));
    }
    setTimeout($.unblockUI, 100);
}

function fn_ElimJugador(idJugador) {    
    var idEqu = $("#cboEquipos").val();
    swal({
        title: "¿Estas seguro?",
        text: `Eliminar el jugador`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (respuesta) {
            if (respuesta) {
                $(".showSweetAlert").LoadingOverlay("show");
                $.ajax({
                    url: '/Jugadores/EliminarJugador',
                    type: 'POST',
                    data: {
                        'idJugador': idJugador
                    },
                    statusCode: {
                        200: function (response) {
                            if (response == "0") {
                                fn_tabJugadores(idEqu);
                                $.growl.notice({ message: "Jugador eliminado" });
                            } else {
                                $.growl.notice({ message: "Error al eliminar el jugador" });
                            }

                        },
                        default: function () {
                            $.growl.notice({ message: "Error al eliminar el jugador" });
                        }
                    }
                });
            }
        }
    )
}

function fn_limpiarCampos() {
    $("#modalNuevoJugador input[type='text']").val("");
    $(".select2").val('0');
    document.getElementById("img").removeAttribute("src");
    document.querySelector('#img').removeAttribute('width');
    document.querySelector('#img').removeAttribute('height');
    iIdJugador = "";
}