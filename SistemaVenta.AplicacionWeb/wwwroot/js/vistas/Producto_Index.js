﻿const MODELO_BASE = {
    idProducto: 0,
    codigoBarra: "",
    marca: "",
    nombre: "",
    idCategoria: 0,
    stock: 0,
    urlImagen: "",
    precio: 0,
    esActivo: 1
}

let tablaData;

$(document).ready(function () {

    fetch("/Categorias/lista")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            if (responseJson.data.length > 0) {
                responseJson.data.forEach((item) => {
                    //console.log(item);
                    $("#cboCategoria").append(
                        $("<option>").val(item.idCategoria).text(item.descripcion)
                    )
                })
            }
        })

    tablaData = $('#tbdata').DataTable({
        responsive: true,
        "ajax": {
            "url": '/Productos/Lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "idProducto", "visible": false, "searchable": false },
            //{
            //    "data": "urlFoto", render: function (data) {
            //        return `<img style="height:60px" src="${data} class="rounded mx-auto d-block"/>`
            //    }
            //},
            {
                "data": "urlImagen", render: function (data) {
                    return `<img style="height:60px" src=${data} class="rounded mx-auto d-block"/>`
                }
            },
            { "data": "codigoBarra" },
            { "data": "marca" },
            { "data": "descripcion" },
            { "data": "nombreCategoria" },
            { "data": "stock" },
            { "data": "precio" },
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
                filename: 'Reporte Productos',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6]
                }
            }, 'pageLength'
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });
});

function mostrarModal(modelo = MODELO_BASE) {
    $("#txtId").val(modelo.idProducto);
    $("#txtCodigoBarra").val(modelo.codigoBarra);
    $("#txtMarca").val(modelo.marca);
    $("#txtDescripcion").val(modelo.descripcion);
    $("#cboCategoria").val(modelo.idCategoria == 0 ? $("#cboCategoria option:first").val() : modelo.idCategoria);
    $("#txtStock").val(modelo.stock);
    $("#txtPrecio").val(modelo.precio);
    $("#cboEstado").val(modelo.esActivo);
    $("#txtImagen").val("");
    document.getElementById("imgProducto").src = modelo.urlImagen;
    //$("#imgProducto").attr("src", modelo.urlImagen);

    $("#modalData").modal("show");

}

$("#btnNuevo").click(function () {
    mostrarModal();
});

$("#btnGuardar").click(function () {

    //debugger;

    const inputs = $("input.input-validar").serializeArray();
    const inputs_sin_validar = inputs.filter((item) => item.value.trim() == "")

    if (inputs_sin_validar.length > 0) {
        const mensaje = `Debe completar el campo : "${inputs_sin_validar[0].name}"`;
        toastr.warning("", mensaje);
        $(`input[name="${inputs_sin_validar[0].name}"]`).focus()

        return;
    }

    const modelo = structuredClone(MODELO_BASE);
    modelo["idProducto"] = parseInt($("#txtId").val());
    modelo["codigoBarra"] = $("#txtCodigoBarra").val();
    modelo["marca"] = $("#txtMarca").val();
    modelo["descripcion"] = $("#txtDescripcion").val();
    modelo["idCategoria"] = $("#cboCategoria").val();
    modelo["stock"] = $("#txtStock").val();
    modelo["precio"] = $("#txtPrecio").val();
    modelo["esActivo"] = $("#cboEstado").val();


    //const inputFoto = document.getElementById("txtFoto");
    const inputFoto = document.getElementById("txtImagen")

    const formData = new FormData();

    //formData.append("foto", inputFoto.files[0])
    formData.append("imagen", inputFoto.files[0])
    formData.append("modelo", JSON.stringify(modelo))

    $("#modalData").find("div.modal-content").LoadingOverlay("show");

    if (modelo.idProducto == 0) {
        fetch("/Productos/Crear", {
            method: "POST",
            body: formData
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    ////tablaData.row.add(responseJson.objeto).draw(false)
                    //tablaData.destroy();
                    //tb_Usuarios();
                    tablaData.row.add(responseJson.object).draw(false);

                    $("#modalData").modal("hide")
                    swal("Listo!!", "El producto fue creado", "success")
                } else {
                    swal("lo sentimos!!", responseJson.mensaje, "error")
                }
            })
    } else {
        fetch("/Productos/Editar", {
            method: "PUT",
            body: formData
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    tablaData.row(filaSeleccionada).data(responseJson.object).draw(false);
                    //tablaData.row(filaSeleccionada).data(responseJson.objeto).draw(false);
                    //tablaData.destroy();
                    //tb_Usuarios();
                    filaSeleccionada = null;
                    $("#modalData").modal("hide")
                    swal("Listo!!", "El producto fue modificado", "success")
                } else {
                    swal("lo sentimos!!", responseJson.mensaje, "error")
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
        text: `Eliminar el producto "${data.descripcion}"`,
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


                fetch(`/Productos/Eliminar?IdProducto=${data.idProducto}`, {
                    method: "DELETE"
                })
                    .then(response => {
                        $(".showSweetAlert").LoadingOverlay("hide");
                        return response.ok ? response.json() : Promise.reject(response);
                    })
                    .then(responseJson => {

                        if (responseJson.estado) {

                            tablaData.row(filaSeleccionada).remove().draw();
                            //tablaData.row(filaSeleccionada).data(responseJson.objeto).draw(false);
                            //tablaData.destroy();
                            //tb_Usuarios();

                            swal("Listo!!", "El producto fue eliminado", "success")
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
        "ajax": {
            "url": '/Productos/Lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "idProducto", "visible": false, "searchable": false },
            //{
            //    "data": "urlFoto", render: function (data) {
            //        return `<img style="height:60px" src="${data} class="rounded mx-auto d-block"/>`
            //    }
            //},
            {
                "data": "urlImagen", render: function (data) {
                    return `<img style="height:60px" src=${data} class="rounded mx-auto d-block"/>`
                }
            },
            { "data": "codigoBarra" },
            { "data": "marca" },
            { "data": "descripcion" },
            { "data": "nombreCategoria" },
            { "data": "stock" },
            { "data": "precio" },
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
                filename: 'Reporte Productos',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6]
                }
            }, 'pageLength'
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });
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

function convertToBase64Img() {
    var archivo = document.getElementById("txtImagen").files[0];
    var reader = new FileReader();
    if (archivo) {

        reader.readAsDataURL(archivo);
        reader.onloadend = function () {
            myString = reader.result;
            document.getElementById("imgProducto").src = reader.result;
        }
    }
}