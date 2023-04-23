var iIdEquipo;

$(document).ready(function () {
    //Función del botón agregar regsitro
    $("#btnRegistrar").click(function () {
        fn_limpiarCampos();
        const demoId = document.querySelector('#hTitulo');
        demoId.textContent = 'Guardar Equipo';
        document.getElementById('btnEdit').style.display = 'none';
        document.getElementById('btnAdd').style.display = 'block';
        $("#AgregarRegistroModal").modal("show");
    });
    //Funcion del boton editar registro
    $("#btnEditar").click(function () {
        $("#EditarRegistroModal").modal("show");
    });
    //Funcion del boron eliminar registro
    $("#btnDel").click(function () {
        fn_DelEquipo();
    });

    fn_tabEquipos();
    //LlenarComboSeleDeporte();
    LlenarComboSeleLiga();


    fn_Select2("#AgregarRegistroModal");
});

function fn_tabEquipos() {
    $("#page-top").LoadingOverlay("show");
    $("#divTablaEquipos").html("");
    $.ajax({
        url: '/Equipo/TablaEquipos',
        type: 'POST',
        //data: {
        //    'idEquipo': idEqu
        //},
        statusCode: {
            200: function (response) {
                if (response != "-1") {
                    if (response != "") {
                        $("#divTablaEquipos").html(response);
                        var table = $('#tblEquipos').DataTable({
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

                            order: [[0, "desc"]],
                            dom: "Bfrtip",
                            buttons: [
                                {
                                    text: 'Exportar Excel',
                                    extend: 'excelHtml5',
                                    title: '',
                                    filename: 'Reporte Categorias',
                                    exportOptions: {
                                        columns: [1, 2]
                                    }
                                }, 'pageLength'
                            ],
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


function LlenarComboSeleDeporte() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    //$.ajax({
    //    url: "RegistroEquipo.aspx/LlenarComboDeporte",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        $("#cboDeportes").html(data.d);
    //        setTimeout($.unblockUI, 100);

    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});
    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Equipo/LlenarComboDeporte',
        type: 'POST',
        statusCode: {
            200: function (response) {
                $("#cboDeportes").html(response);
                $("#page-top").LoadingOverlay("hide");
            }
        },
        default: function () {
            $("#page-top").LoadingOverlay("hide");
            $.growl.error({ message: textStatus });
        }
    });
}

function LlenarComboSeleLiga() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    //$.ajax({
    //    url: "RegistroEquipo.aspx/LlenarComboLiga",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        $("#cboLiga").html(data.d);
    //        setTimeout($.unblockUI, 100);

    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});
    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Equipo/LlenarComboLiga',
        type: 'POST',
        statusCode: {
            200: function (response) {
                $("#cboLiga").html(response);
                $("#page-top").LoadingOverlay("hide");
            }
        },
        default: function () {
            $("#page-top").LoadingOverlay("hide");
            $.growl.error({ message: textStatus });
        }
    });
}

function fn_AddEquipo() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    $("#page-top").LoadingOverlay("show");
    var error = "";
    var sEquipo = $("#txtNombre").val();
    var sClave = $("#txtClave").val();
    var sColor = $("#txtColor").val();
    var sDirector = $("#txtDirector").val();
    var iDeporte = 0;
    var iLiga = $("#cboLiga").val();

    if (sEquipo != "" && sEquipo != undefined) {
        if (sClave != "" && sClave != undefined) {
            if (sColor != "" && sColor != undefined) {
                if (sDirector != "" && sDirector != undefined) {
                    if (iLiga != "0" && iLiga != undefined) {
                        //$.ajax({
                        //    url: "RegistroEquipo.aspx/InsertarEquipo",
                        //    data: "{sNombre: '" + sEquipo + "', sClave: '" + sClave + "', sColor: '" + sColor + 
                        //      "', sDirector: '" + sDirector + "', iDeporte: " + iDeporte + ", iLiga: '" + iLiga + "'}",
                        //    dataType: "json",
                        //    type: "POST",
                        //    contentType: "application/json; charset=utf-8",
                        //    success: function (data) {
                        //        if (data.d == "1") {
                        //            $.growl.error({ message: "El equipo ya existe" });
                        //        } else if (data.d == "2") {
                        //            $.growl.error({ message: "Error al insertar" });
                        //        } else {
                        //            $("#AgregarRegistroModal").modal("hide");
                        //            $.growl.warning({ message: "Equipo agregado" });
                        //            fn_tabEquipos();
                        //            fn_limpiarCampos();
                        //        }
                        //    },
                        //    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //        setTimeout($.unblockUI, 100);
                        //        $.growl.error({ message: textStatus });
                        //    }
                        //});
                        $.ajax({
                            url: '/Equipo/InsertarEquipo',
                            type: 'POST',
                            data: {
                                'sNombre': sEquipo,
                                'sClave': sClave,
                                'sColor': sColor,
                                'sDirector': sDirector,
                                'iDeporte': iDeporte,
                                'iLiga': iLiga
                            },
                            statusCode: {
                                200: function (response) {

                                    if (response == "1") {
                                        $.growl.error({ message: "El equipo ya existe" });
                                    } else if (response == "2") {
                                        $.growl.error({ message: "Error al insertar" });
                                    } else {
                                        $("#AgregarRegistroModal").modal("hide");
                                        $.growl.notice({ message: "Equipo agregado" });
                                        fn_tabEquipos();
                                        fn_limpiarCampos();
                                    }
                                    $("#page-top").LoadingOverlay("hide");
                                },
                                default: function () {
                                    alertify.error("Error al guardar el equipo");
                                    $("#page-top").LoadingOverlay("hide");
                                }
                            }
                        });
                    } else {
                        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de elegir una liga</span>';
                        $('#cboLiga').after($(error).fadeOut(2000));
                    }
                } else {
                    error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el nombre</span>';
                    $('#txtDirector').after($(error).fadeOut(2000));
                }
            } else {
                error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar al menoz un color</span>';
                $('#txtColor').after($(error).fadeOut(2000));
            }
        } else {
            error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar la clave</span>';
            $('#txtClave').after($(error).fadeOut(2000));
        }
    } else {
        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el nombre</span>';
        $('#txtNombre').after($(error).fadeOut(2000));
    }

    setTimeout($.unblockUI, 100);
}

function fn_EditEquipo(idEquipo) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });

    //$.ajax({
    //    url: "RegistroEquipo.aspx/ViewEquipo",
    //    data: "{idEquipo: '" + idEquipo + "'}",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        fn_limpiarCampos();
    //        iIdEquipo = data.d[0];
    //        $("#txtNombre").val(data.d[1]);
    //        $("#txtClave").val(data.d[3]);
    //        $("#txtColor").val(data.d[2]);
    //        $("#txtDirector").val(data.d[5]);
    //        $("#cboLiga").select2("val", data.d[4]);

    //        const demoId = document.querySelector('#hTitulo');
    //        demoId.textContent = 'Editar Equipo';

    //        document.getElementById('btnEdit').style.display = 'block';
    //        document.getElementById('btnAdd').style.display = 'none';
    //        $("#AgregarRegistroModal").modal("show");
    //        //console.log(data.d);
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});
    //setTimeout($.unblockUI, 100);
    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Equipo/ViewEquipo',
        type: 'POST',
        data: {
            'idEquipo': idEquipo
        },
        statusCode: {
            200: function (response) {
                if (response.length != 0) {

                    fn_limpiarCampos();
                    iIdEquipo = response[0];
                    $("#txtNombre").val(response[1]);
                    $("#txtClave").val(response[3]);
                    $("#txtColor").val(response[2]);
                    $("#txtDirector").val(response[5]);
                    $("#cboLiga").select2("val", response[4]);

                    const demoId = document.querySelector('#hTitulo');
                    demoId.textContent = 'Editar Equipo';

                    document.getElementById('btnEdit').style.display = 'block';
                    document.getElementById('btnAdd').style.display = 'none';
                    $("#AgregarRegistroModal").modal("show");
                    $("#page-top").LoadingOverlay("hide");

                }
                $("#page-top").LoadingOverlay("hide");
            },
            default: function () {
                alertify.error("Error al buscar equipo");
                $("#page-top").LoadingOverlay("hide");
            }
        }
    });
}

function fn_EditarEquipo() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    $("#page-top").LoadingOverlay("show");
    var error = "";
    var sEquipo = $("#txtNombre").val();
    var sClave = $("#txtClave").val();
    var sColor = $("#txtColor").val();
    var sDirector = $("#txtDirector").val();
    var iDeporte = 0;
    var iLiga = $("#cboLiga").val();

    if (sEquipo != "" && sEquipo != undefined) {
        if (sClave != "" && sClave != undefined) {
            if (sColor != "" && sColor != undefined) {
                if (sDirector != "" && sDirector != undefined) {
                    if (iLiga != "0" && iLiga != undefined) {
                            //url: "RegistroEquipo.aspx/EditarEquipo",
                            //data: "{sNombre: '" + sEquipo + "', sClave: '" + sClave + "', sColor: '" + sColor 
                            //+ "', sDirector: '" + sDirector + "', iDeporte: " + iDeporte 
                            //+ ", iLiga: '" + iLiga + "', iIdEquipo: " + iIdEquipo + "}",
                            //dataType: "json",
                            //type: "POST",
                            //contentType: "application/json; charset=utf-8",
                            //success: function (data) {
                            //    if (data.d == "2") {
                            //        $.growl.error({ message: "Error al editar" });
                            //    } else {
                            //        $("#AgregarRegistroModal").modal("hide");
                            //        $.growl.warning({ message: "Equipo editado" });
                            //        fn_tabEquipos();
                            //        fn_limpiarCampos();
                            //    }
                            //},
                            //error: function (XMLHttpRequest, textStatus, errorThrown) {
                            //    setTimeout($.unblockUI, 100);
                            //    $.growl.error({ message: textStatus });
                            //}
                            $.ajax({
                                url: '/Equipo/EditarEquipo',
                                type: 'POST',
                                data: {
                                    'sNombre': sEquipo,
                                    'sClave': sClave,
                                    'sColor': sColor,
                                    'sDirector': sDirector,
                                    'iDeporte': iDeporte,
                                    'iLiga': iLiga,
                                    'iIdEquipo': iIdEquipo
                                },
                                statusCode: {
                                    200: function (response) {

                                        if (response == "1") {
                                            $.growl.error({ message: "Error al editar" });
                                        } else if (response == "2") {
                                            $.growl.error({ message: "Error al editar" });
                                        } else {
                                            $("#AgregarRegistroModal").modal("hide");
                                            $.growl.notice({ message: "Equipo editado" });
                                            fn_tabEquipos();
                                            fn_limpiarCampos();
                                        }
                                        $("#page-top").LoadingOverlay("hide");
                                    },
                                    default: function () {
                                        alertify.error("Error al editar");
                                        $("#page-top").LoadingOverlay("hide");
                                    }
                                }
                            });
                        setTimeout($.unblockUI, 100);
                    } else {
                        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de elegir una liga</span>';
                        $('#cboLiga').after($(error).fadeOut(2000));
                    }
                } else {
                    error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el nombre</span>';
                    $('#txtDirector').after($(error).fadeOut(2000));
                }
            } else {
                error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar al menoz un color</span>';
                $('#txtColor').after($(error).fadeOut(2000));
            }
        } else {
            error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar la clave</span>';
            $('#txtClave').after($(error).fadeOut(2000));
        }
    } else {
        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el nombre</span>';
        $('#txtNombre').after($(error).fadeOut(2000));
    }

    setTimeout($.unblockUI, 100);

}

function fn_EliminarEquipo(idEquipo) {
    //$("#EliminarRegistroModal").modal("show");
    iIdEquipo = idEquipo;
    swal({
        title: "¿Estas seguro?",
        text: `Eliminar el equipo`,
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
                    url: '/Equipo/EliminarEquipo',
                    type: 'POST',
                    data: {
                        'idEquipo': idEquipo
                    },
                    statusCode: {
                        200: function (response) {
                            if (response == "0") {
                                fn_tabEquipos();
                                fn_limpiarCampos();
                                $.growl.notice({ message: "Equipo eliminado" });
                            } else {
                                $.growl.notice({ message: "Error al eliminar el equipo" });
                            }

                        },
                        default: function () {
                            $.growl.error({ message: "Error al eliminar el equipo" });
                        }
                    }
                });
            }
        }
    )
}

//function fn_DelEquipo() {
//    $.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });

//    $.ajax({
//        url: "RegistroEquipo.aspx/DeleteEquipo",
//        data: "{idEquipo: '" + iIdEquipo + "'}",
//        dataType: "json",
//        type: "POST",
//        contentType: "application/json; charset=utf-8",
//        success: function (data) {
//            if (data.d == "2") {
//                $.growl.error({ message: "Error al eliminar" });
//            } else {
//                $("#EliminarRegistroModal").modal("hide");
//                $.growl.warning({ message: "Equipo eliminado" });
//                fn_tabEquipos();
//                fn_limpiarCampos();
//            }
//        },
//        error: function (XMLHttpRequest, textStatus, errorThrown) {
//            setTimeout($.unblockUI, 100);
//            $.growl.error({ message: textStatus });
//        }
//    });
//    setTimeout($.unblockUI, 100);
//}


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

function fn_limpiarCampos() {
    $("#txtNombre").val();
    $("#txtClave").val();
    $("#txtColor").val();
    $("#txtDirector").val();
    $("#cboDeportes").select2("val", "");;
    $("#cboLiga").select2("val", "");
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