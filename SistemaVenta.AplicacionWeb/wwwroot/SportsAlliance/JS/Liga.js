var iIdLiga;

$(document).ready(function () {
    tablaLigas();

    $("#btnRegistrar").click(function () {
        LlenarComboSeleDepos();
        $("#modalRegistrarLiga").modal("show");
    });

    $("#btnIniLiga").click(function () {
        fn_IniciaLiga();
    });

    $('.select2').select2({
        dropdownParent: $("#modalRegistrarLiga"),
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
});

function tablaLigas() {
    $("#tabContect").html("");
    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Liga/TablaLiga',
        type: 'POST',
        statusCode: {
            200: function (response) {
                $("#tabContect").html(response);
                $("#page-top").LoadingOverlay("hide");
            }
        },
        default: function () {
            $("#page-top").LoadingOverlay("hide");
            $.growl.error({ message: textStatus });
        }
    });
    $("#page-top").LoadingOverlay("hide");

}

function fn_EditLiga(idLiga) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    let sCate;
    var info = "";
    var sDeporte = "";
    //var info = "";
    //$.ajax({
    //    url: "Liga.aspx/SelecLiga",
    //    data: "{idLiga: " + idLiga + "}",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        const demoId = document.querySelector('#hTitulo1');
    //        demoId.textContent = data.d[1];
    //        if (data.d[2] == "1") {
    //            sDeporte = "Futból";
    //        }

    //        switch (data.d[3]) {
    //            case "1":
    //                sCate = "Infantil";
    //                break;
    //            case "2":
    //                sCate = "Juvenil";
    //                break;
    //            case "3":
    //                sCate = "Adulta";
    //        }

    //        info += '<div class="col-md-4 form-group"><label><b>Deporte:</b></label ><span >' + sDeporte + '</span></div >' +
    //            '<div class="col-md-4 form-group"><label><b>Categoria:</b></label><span>' + sCate + '</span></div>'
    //        $('#lblInfoRegla').empty();
    //        $('#lblInfoRegla').append(info);
    //        tbEquipos(idLiga);
    //        fn_GenerarTablaJor(idLiga);
    //        fn_GeneTablaPos(idLiga);
    //        iIdLiga = idLiga;

    //        $("#modalSelctLiga").modal("show");
    //        setTimeout($.unblockUI, 100);
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});

    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Liga/SelectLiga',
        type: 'POST',
        data: {
            'idLiga': idLiga
        },
        statusCode: {
            200: function (response) {

                const demoId = document.querySelector('#hTitulo1');
                demoId.textContent = response[1];
                if (response[2] == "1") {
                    sDeporte = "Futból";
                }

                switch (response[3]) {
                    case "1":
                        sCate = "Infantil";
                        break;
                    case "2":
                        sCate = "Juvenil";
                        break;
                    case "3":
                        sCate = "Adulta";
                }

                info += '<div class="col-md-4 form-group"><label><b>Deporte:</b></label> <span >' + sDeporte + '</span></div >' +
                    '<div class="col-md-4 form-group"><label><b>Categoria: </b></label> <span>' + sCate + '</span></div>'
                $('#lblInfoRegla').empty();
                $('#lblInfoRegla').append(info);
                tbEquipos(idLiga);
                fn_GenerarTablaJor(idLiga);
                fn_GeneTablaPos(idLiga);
                iIdLiga = idLiga;

                $("#modalSelctLiga").modal("show");

                $("#page-top").LoadingOverlay("hide");
            },
            default: function () {
                alertify.error("Error al generar la tabla");
                $("#page-top").LoadingOverlay("hide");
            }
        }
    });
}

function tbEquipos(idLiga) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    //$("#divTablaEquipos").html("");
    //$.ajax({
    //    url: "Liga.aspx/TablaEquipos",
    //    data: "{idLiga: " + idLiga + "}",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        if (data.d != "-1") {
    //            if (data.d != "") {
    //                $("#divTablaEquipos").html(data.d);
    //                var table = $("#tblEquipos").DataTable({
    //                    scrollX: true,
    //                    language: {
    //                        "decimal": "",
    //                        "emptyTable": "No hay información",
    //                        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
    //                        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
    //                        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
    //                        "infoPostFix": "",
    //                        "thousands": ",",
    //                        "lengthMenu": "Mostrar _MENU_ Entradas",
    //                        "loadingRecords": "Cargando...",
    //                        "processing": "Procesando...",
    //                        "search": "Buscar:",
    //                        "zeroRecords": "Sin resultados encontrados",
    //                        "paginate": {
    //                            "first": "Primero",
    //                            "last": "Ultimo",
    //                            "next": "Siguiente",
    //                            "previous": "Anterior"
    //                        }
    //                    },
    //                    lengthMenu: [
    //                        [2, 10, 50, -1],
    //                        [2, 10, 50, 'Todos'],
    //                    ],

    //                });
    //            }
    //            setTimeout($.unblockUI, 100);
    //        }
    //        else {
    //            setTimeout($.unblockUI, 100);
    //            alertify.error("Error al generar la tabla");
    //        }
    //        setTimeout($.unblockUI, 100);
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});

    $("#page-top").LoadingOverlay("show");
    $("#divTablaEquipos").html("");
    $.ajax({
        url: '/Liga/TablaEquipos',
        type: 'POST',
        data: {
            'idLiga': idLiga
        },
        statusCode: {
            200: function (response) {
                if (response != "-1") {
                    if (response != "") {
                        $("#divTablaEquipos").html(response);
                        $('#tblEquipos').DataTable({
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
                            lengthMenu: [
                                [2, 10, 50, -1],
                                [2, 10, 50, 'Todos'],
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


function LlenarComboSeleDepos() {

    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Liga/LlenarComboDeDeportes',
        type: 'POST',
        statusCode: {
            200: function (response) {
                $("#cboDeporte").html(response);
                $("#page-top").LoadingOverlay("hide");
            }
        },
        default: function () {
            $("#page-top").LoadingOverlay("hide");
            $.growl.error({ message: textStatus });
        }
    });
    $("#page-top").LoadingOverlay("hide");
}

function fn_AddLiga() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    $("#page-top").LoadingOverlay("show");
    var error = "";
    var sNomb = $("#txtNombre").val();
    var iDeporte = $("#cboDeporte").val();
    var iCategoria = $("#cboCategoria").val();

    if (sNomb != "" && sNomb != undefined) {
        if (iDeporte != "0" && iDeporte != undefined) {
            if (iCategoria != "0" && iCategoria != undefined) {
                //$.ajax({
                //    url: "Liga.aspx/InsertarLiga",
                //    data: "{sNombre: '" + sNomb + "', iDeporte: " + iDeporte + ", iCategoria: " + iCategoria + "}",
                //    dataType: "json",
                //    type: "POST",
                //    contentType: "application/json; charset=utf-8",
                //    success: function (data) {
                //        if (data.d == "1") {
                //            $.growl.error({ message: "La liga ya existe" });
                //        } else if (data.d == "2") {
                //            $.growl.error({ message: "Error al insertar" });
                //        } else {
                //            $("#modalRegistrarLiga").modal("hide");
                //            $.growl.warning({ message: "Liga agregado" });
                //            tablaLigas();
                //            fn_limpiarCampos();
                //        }
                //    },
                //    error: function (XMLHttpRequest, textStatus, errorThrown) {
                //        setTimeout($.unblockUI, 100);
                //        $.growl.error({ message: textStatus });
                //    }
                //});
                $.ajax({
                    url: '/Liga/InsertarLiga',
                    type: 'POST',
                    data: {
                        'sNombre': sNomb,
                        'iDeporte': iDeporte,
                        'iCategoria': iCategoria
                    },
                    statusCode: {
                        200: function (response) {

                            if (response == "1") {
                                $.growl.error({ message: "La liga ya existe" });
                            } else if (response == "2") {
                                $.growl.error({ message: "Error al insertar" });
                            } else {
                                $("#modalRegistrarLiga").modal("hide");
                                $.growl.notice({ message: "Liga agregada" });
                                tablaLigas();
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
                error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de seleccionar la categoria</span>';
                $('#cboCategoria').after($(error).fadeOut(2000));
            }
        } else {
            error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de seleccionar el deporte</span>';
            $('#cboDeporte').after($(error).fadeOut(2000));
        }
    } else {
        error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar nombre</span>';
        $('#txtNombre').after($(error).fadeOut(2000));
    }
    setTimeout($.unblockUI, 100);
}

function fn_IniciaLiga() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    ////var oJuegos = [];
    ////var numParJornadas;
    ////var numCantFec;
    //$.ajax({
    //    url: "Liga.aspx/IniciarLiga",
    //    data: "{iIdLiga: " + iIdLiga + "}",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {

    //        if (data.d == "-1") {
    //            $.growl.error({ message: "Ya se encuentra la liga iniciada" });
    //        }
    //        else if (data.d == "-2") {
    //            $.growl.error({ message: "Se necesita agregar un equipo mas para que sean pares" });
    //        } else if (data.d == "-3") {
    //            //Se valida que se haya insertado correctamente
    //            $.growl.error({ message: "Error al insertar las jornadas" });
    //        } else {
    //            //Si no cumple las demas quiere decir que se inserto correctamente
    //            fn_GenerarTablaJor(iIdLiga);
    //        }

    //        setTimeout($.unblockUI, 100);
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});
    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Liga/IniciarLiga',
        type: 'POST',
        data: {
            'iIdLiga': iIdLiga
        },
        statusCode: {
            200: function (response) {

                if (response == "-1") {
                    $.growl.error({ message: "Ya se encuentra la liga iniciada" });
                } else if (response == "-2") {
                    $.growl.error({ message: "Se necesita agregar un equipo mas para que sean pares" });
                } else {
                    fn_GenerarTablaJor(iIdLiga);
                    $.growl.notice({ message: "Liga Iniciada" });
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

function fn_GenerarTablaJor(iIdLiga) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    //$("#divTablaJornadas").html("");
    //$.ajax({
    //    url: "Liga.aspx/TablaJornada",
    //    data: "{idLiga: " + iIdLiga + "}",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        if (data.d != "-1") {
    //            if (data.d != "") {
    //                $("#divTablaJornadas").html(data.d);
    //                var table = $('table.display').DataTable({
    //                    scrollX: true,
    //                    language: {
    //                        "decimal": "",
    //                        "emptyTable": "No hay información",
    //                        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
    //                        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
    //                        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
    //                        "infoPostFix": "",
    //                        "thousands": ",",
    //                        "lengthMenu": "Mostrar _MENU_ Entradas",
    //                        "loadingRecords": "Cargando...",
    //                        "processing": "Procesando...",
    //                        "search": "Buscar:",
    //                        "zeroRecords": "Sin resultados encontrados",
    //                        "paginate": {
    //                            "first": "Primero",
    //                            "last": "Ultimo",
    //                            "next": "Siguiente",
    //                            "previous": "Anterior"
    //                        }
    //                    },
    //                    lengthMenu: [
    //                        [2, 10, 50, -1],
    //                        [2, 10, 50, 'Todos'],
    //                    ],
    //                });
    //            }
    //            setTimeout($.unblockUI, 100);
    //        }
    //        else {
    //            setTimeout($.unblockUI, 100);
    //            alertify.error("Error al generar la tabla");
    //        }
    //        setTimeout($.unblockUI, 100);
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});
    $("#page-top").LoadingOverlay("show");
    $("#divTablaJornadas").html("");
    $.ajax({
        url: '/Liga/TablaJornada',
        type: 'POST',
        data: {
            'idLiga': iIdLiga
        },
        statusCode: {
            200: function (response) {
                if (response != "-1") {
                    if (response != "") {
                        $("#divTablaJornadas").html(response);
                        $('table.display').DataTable({
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
                            lengthMenu: [
                                [2, 10, 50, -1],
                                [2, 10, 50, 'Todos'],
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

function fn_EditGol(idPartido) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    $("#page-top").LoadingOverlay("show");
    var golLocal = $("#golLocal" + idPartido).val();
    var golVisitante = $("#golVisitante" + idPartido).val();

    //$.ajax({
    //    url: "Liga.aspx/ActGoles",
    //    data: "{idPartido: '" + idPartido + "', iGolLocal: '" + golLocal + "', iGolVisitante: '" + golVisitante + "'}",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        if (data.d == "1") {
    //            $.growl.error({ message: "Error al acualizar" });
    //        } else if (data.d == "2") {
    //            $.growl.error({ message: "Error al acualizar" });
    //        } else {
    //            $.growl.warning({ message: "Partido Actualizado" });
    //            fn_GenerarTablaJor(iIdLiga);
    //            //fn_GeneTablaPos(iIdLiga);
    //        }
    //        setTimeout($.unblockUI, 100);

    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});
    $.ajax({
        url: '/Liga/ActGoles',
        type: 'POST',
        data: {
            'idPartido': idPartido,
            'iGolLocal': golLocal,
            'iGolVisitante': golVisitante
        },
        statusCode: {
            200: function (response) {

                if (response == "1") {
                    $.growl.error({ message: "Error al acualizar" });
                } else if (response == "2") {
                    $.growl.error({ message: "Error al acualizar" });
                } else {
                    fn_GenerarTablaJor(iIdLiga);
                    fn_GeneTablaPos(iIdLiga);
                    $.growl.notice({ message: "Partido Actualizado" });
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

function fn_FinJuego(idPartido, idLocal, idVisitante) {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    //$("#page-top").LoadingOverlay("show");
    var golLocal = $("#golLocal" + idPartido).val();
    var golVisitante = $("#golVisitante" + idPartido).val();
    var iGanador;

    if (golLocal == "") golLocal = 0;
    if (golVisitante == "") golVisitante = 0;

    if (parseInt(golLocal) > parseInt(golVisitante)) {
        iGanador = idLocal;
    } else if (parseInt(golLocal) < parseInt(golVisitante)) {
        iGanador = idVisitante;
    } else {
        iGanador = 0;
    }

    //$.ajax({
    //    url: "Liga.aspx/FinPartido",
    //    data: "{idPartido: '" + idPartido + "', iGanador: '" + iGanador + "', iGolLocales:'" + golLocal + "', iGolVisitante:'" + golVisitante + "'}",
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        if (data.d == "1") {
    //            $.growl.error({ message: "Error al finalizar el partido" });
    //        } else if (data.d == "2") {
    //            $.growl.error({ message: "Error al finalizar el partido" });
    //        } else {
    //            $.growl.notice({ message: "Partido Finalizado" });
    //            fn_GenerarTablaJor(iIdLiga);
    //        }
    //        setTimeout($.unblockUI, 100);
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        setTimeout($.unblockUI, 100);
    //        $.growl.error({ message: textStatus });
    //    }
    //});

    swal({
        title: "¿Estas seguro?",
        text: `De terminar el partido`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si, terminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (respuesta) {
            if (respuesta) {
                $(".showSweetAlert").LoadingOverlay("show");
                $.ajax({
                    url: '/Liga/FinPartido',
                    type: 'POST',
                    data: {
                        'idPartido': idPartido,
                        'iGanador': iGanador,
                        'iGolLocal': golLocal,
                        'iGolVisitante': golVisitante
                    },
                    statusCode: {
                        200: function (response) {

                            if (response == "1") {
                                $.growl.error({ message: "Error al finalizar el partido" });
                            } else if (response == "2") {
                                $.growl.error({ message: "Error al finalizar el partido" });
                            } else {
                                fn_GenerarTablaJor(iIdLiga);
                                fn_GeneTablaPos(iIdLiga);
                                $.growl.notice({ message: "Partido Finalizado" });
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
        }
    )
}

function fn_GeneTablaPos(iIdLiga) {
    //("#page-top").LoadingOverlay("show");
    $("#divTablaPuntos").html("");
    $.ajax({
        url: '/Liga/TablaPos',
        type: 'POST',
        data: {
            'idLiga': iIdLiga
        },
        statusCode: {
            200: function (response) {
                if (response != "-1") {
                    if (response != "") {
                        $("#divTablaPuntos").html(response);
                        $('#tblPuntos').DataTable({
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
                            lengthMenu: [
                                [2, 10, 50, -1],
                                [2, 10, 50, 'Todos'],
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

function fn_limpiarCampos() {
    $("#txtNombre").val("");
    $("#cboDeporte").select2("val", "");
    $("#cboCategoria").select2("val", "");
}

$(document).ready(function () {
    activaTab('aaa');
});

function activaTab(tab) {
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};
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
}
