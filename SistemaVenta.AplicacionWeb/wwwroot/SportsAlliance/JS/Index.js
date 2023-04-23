$(document).ready(function () {
    document.getElementById("text1").innerHTML = "";
    LlenarComboSeleLiga();
    fn_Select2("#selectTo");

    //Para obtener el id del combo de roles
    // y pasarselo a cargarPrivilegiosRol
    $("#cboLiga").change(function () {
        var idLiga = $("#cboLiga").val()
        if (idLiga != null || idLiga != 0) {
            fn_GenerarTablaJor(idLiga);
            fn_GeneTablaPos(idLiga);
        }
    });

});

function LlenarComboSeleLiga() {
    
    $("#page-top").LoadingOverlay("show");
    $.ajax({
        url: '/Home/LlenarComboLiga',
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

function fn_GeneTablaPos(iIdLiga) {
    $("#page-top").LoadingOverlay("show");
    document.getElementById("text1").innerHTML = "Puntos";
   
    $.ajax({
        url: '/Home/TablaPos',
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
                            order: [[9, "asc"]],
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

function fn_GenerarTablaJor(iIdLiga) {
    $("#divTablaJornadas").html("");
    $.ajax({
        url: '/Home/TablaJornada',
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
                            //lengthMenu: [
                            //    [2, 10, 50, -1],
                            //    [2, 10, 50, 'Todos'],
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

////Función que cambia la version del select a la 2
////para tener un campo de texto de busqueda
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