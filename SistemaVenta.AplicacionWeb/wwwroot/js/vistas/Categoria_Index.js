const MODELO_BASE = {
    idCategoria: 0,
    descripcion: "",
    esActivo: 1
}

let tablaData;

$(document).ready(function () {

    //fetch("/Usuario/ListaRoles")
    //    .then(response => {
    //        return response.ok ? response.json() : Promise.reject(response);
    //    })
    //    .then(responseJson => {
    //        if (responseJson.length > 0) {
    //            responseJson.forEach((item) => {
    //                $("#cboRol").append(
    //                    $("<option>").val(item.idRol).text(item.descripcion)
    //                )
    //            })
    //        }
    //    })
    
    tablaData = $('#tbdata').DataTable({
        responsive: true,
        "ajax": {
            "url": '/Categorias/lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "idCategoria", "visible": false, "searchable": false },
            { "data": "descripcion" },
            {
                "data": "esActivo", render: function (data) {
                    if (data == 1) {
                        return '<span class="badge badge-info">Activo</span>'
                    } else {
                        return '<span class="badge badge-danger">N Activo</span>'
                    }
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-danger btn-eliminar btn-sm"><i class="fas fa-trash-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }
        ],
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
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });
});

function mostrarModal(modelo = MODELO_BASE) {
    $("#txtId").val(modelo.idCategoria);
    $("#txtDescripcion").val(modelo.descripcion);
    $("#cboEstado").val(modelo.esActivo);

    $("#modalData").modal("show");
}

$("#btnNuevo").click(function () {
    mostrarModal();
});

$("#btnGuardar").click(function () {

    if ($("#txtDescripcion").val().trim() == "") {
        //$.growl.error({ message: "Debe completar el campo: descripción" });
        toastr.warning("", "Debe completar el campo: descripción")
        $("#txtDescripcion").focus()
        return;
    }

    const modelo = structuredClone(MODELO_BASE);
    modelo["idCategoria"] = parseInt($("#txtId").val());
    modelo["descripcion"] = $("#txtDescripcion").val();
    modelo["esActivo"] = $("#cboEstado").val();

    $("#modalData").find("div.modal-content").LoadingOverlay("show");

    if (modelo.idCategoria == 0) {
        fetch("/Categorias/Crear", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    //tablaData.row.add(responseJson.objeto).draw(false)
                    tablaData.destroy();
                    tb_Usuarios();

                    $("#modalData").modal("hide")
                    swal("Listo!!", "La categoria fue creada", "success")
                } else {
                    $.growl.error({ message: responseJson.mensaje });
                    //swal("lo sentimos!!", responseJson.mensaje, "error")
                }
            })
    } else {
        fetch("/Categorias/Editar", {
            method: "PUT",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {


                    //tablaData.row(filaSeleccionada).data(responseJson.objeto).draw(false);
                    tablaData.destroy();
                    tb_Usuarios();
                    filaSeleccionada = null;
                    $("#modalData").modal("hide")
                    swal("Listo!!", "La categoria fue modificada", "success")
                } else {
                    //swal("lo sentimos!!", responseJson.mensaje, "error")
                    $.growl.error({ message: responseJson.mensaje });
                }
            })
    }

});


let filaSeleccionada;
$("#tbdata tbody").on("click", ".btn-editar", function () {

    if ($(this).closest("tr").hasClass("child")) {
        filaSeleccionada = $(this).closest("tr").prev();
    } else {
        filaSeleccionada = $(this).closest("tr");
    }

    const data = tablaData.row(filaSeleccionada).data();
    //console.log(data);
    mostrarModal(data);
})

$("#tbdata tbody").on("click", ".btn-eliminar", function () {

    let fila;
    if ($(this).closest("tr").hasClass("child")) {
        filaSeleccionada = $(this).closest("tr").prev();
    } else {
        filaSeleccionada = $(this).closest("tr");
    }

    const data = tablaData.row(filaSeleccionada).data();
    swal({
        title: "¿Estas seguro?",
        text: `Eliminar la categoria "${data.descripcion}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (respuesta) {
            if (respuesta) {
                $(".showSweetAlert").LoadingOverlay("show");


                fetch(`/Categorias/Eliminar?IdCategoria=${data.idCategoria}`, {
                    method: "DELETE"
                })
                    .then(response => {
                        $(".showSweetAlert").LoadingOverlay("hide");
                        return response.ok ? response.json() : Promise.reject(response);
                    })
                    .then(responseJson => {

                        if (responseJson.estado) {


                            //tablaData.row(filaSeleccionada).data(responseJson.objeto).draw(false);
                            tablaData.destroy();
                            tb_Usuarios();

                            swal("Listo!!", "La categoria fue eliminada", "success")
                        } else {
                            swal("lo sentimos!!", responseJson.mensaje, "error")
                        }
                    })
            }
        }
    )
})

function tb_Usuarios() {
    tablaData = $('#tbdata').DataTable({
        responsive: true,
        scrollX: true,
        "ajax": {
            "url": 'Categorias/lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "idCategoria", "visible": false, "searchable": false },
            { "data": "descripcion" },
            {
                "data": "esActivo", render: function (data) {
                    if (data == 1) {
                        return '<span class="badge badge-info">Activo</span>'
                    } else {
                        return '<span class="badge badge-danger">N Activo</span>'
                    }
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-danger btn-eliminar btn-sm"><i class="fas fa-trash-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }
        ],
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
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });
}