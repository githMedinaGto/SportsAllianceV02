$(document).ready(function () {

    $(".container-fluid").LoadingOverlay("show");

    fetch("/Home/ObtenerUsuario")
        .then(response => {
            $(".container-fluid").LoadingOverlay("hide");
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            //console.log(responseJson)

            if (responseJson.estado) {
                const d = responseJson.object

                $("#imgFoto").attr("src", d.urlFoto)

                $("#txtNombre").val(d.nombre)
                $("#txtCorreo").val(d.correo)
                $("#txTelefono").val(d.telefono)
                $("#txtRol").val(d.nombreRol)
                
            } else {
                swal("Lo sentimos", responseJson.mensaje, "error")
            }
        })
})

$("#btnGuardarCambios").click(function () {
    if ($("#txtCorreo").val().trim() == "") {
        toastr.warning("", "Debe completar el campo correo")
        $("#txtCorreo").focus()
        return;
    }

    if ($("#txTelefono").val().trim() == "") {
        toastr.warning("", "Debe completar el campo telefono")
        $("#txTelefono").focus()
        return;
    }

    swal({
        title: "¿Desea guardar los cambios?",
        //text: `Eliminar la categoria "${data.descripcion}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (respuesta) {
            if (respuesta) {
                $(".showSweetAlert").LoadingOverlay("show");

                let modelo = {
                    correo: $("#txtCorreo").val().trim(),
                    telefono: $("#txTelefono").val().trim()

                }

                fetch("/Home/GuardarPerfil", {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    body: JSON.stringify(modelo)
                })
                    .then(response => {
                        $(".showSweetAlert").LoadingOverlay("hide");
                        return response.ok ? response.json() : Promise.reject(response);
                    })
                    .then(responseJson => {

                        if (responseJson.estado) {

                            swal("Listo!!", "Los cambios fueron guardados", "success")
                        } else {
                            swal("lo sentimos!!", responseJson.mensaje, "error")
                        }
                    })
            }
        }
    )
})

$("#btnCambiarClave").click(function () {

    if ($("#txtClaveNueva").val() == "" || $("#txtConfirmarClave").val() == "") {
        $.growl.error({ message: "Favor de ingresar contenido a los campos" });
        //toastr.warning("", "Las contraseñas no conciden")
        //$("#txtCorreo").focus()
        return;
    }

    const inputs = $("input.input-validar").serializeArray();
    const inputs_sin_validar = inputs.filter((item) => item.value.trim() == "")

    if (inputs_sin_validar.length > 0) {
        const mensaje = `Debe completar el campo : "${inputs_sin_validar[0].name}"`;
        toastr.warning("", mensaje);
        $(`input[name="${inputs_sin_validar[0].name}"]`).focus()

        return;
    }

    if ($("#txtClaveNueva").val().trim() != $("#txtConfirmarClave").val().trim()) {
        $.growl.error({ message: "Las contraseñas no conciden" });
        //toastr.warning("", "Las contraseñas no conciden")
        //$("#txtCorreo").focus()
        return;
    }

    if (!validarContrasena($("#txtClaveNueva").val().trim())) {

        var mensaje = "La contraseña debe contener al menos:\n";
        mensaje += "- 8 caracteres\n";
        mensaje += "- 1 letra mayúscula\n";
        mensaje += "- 1 letra minúscula\n";
        mensaje += "- 1 número\n";
        mensaje += "- 1 carácter especial (como !@#$%^&*)\n";
        $.growl.error({ title: "La contraseña no es segura", message: mensaje });
        //toastr.warning("", "La contraseña no es segura")
        return;
    } 

    let modelo = {
        claveActual: $("#txtClaveActual").val().trim(),
        claveNueva: $("#txtClaveNueva").val().trim()
    }

    fetch("/Home/CambiarClave", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(modelo)
    })
        .then(response => {
            $(".showSweetAlert").LoadingOverlay("hide");
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {

            if (responseJson.estado) {

                swal("Listo!!", "Su contraseña fue actualizada", "success")
                $("input.input-validar").val("");
            } else {
                swal("lo sentimos!!", responseJson.mensaje, "error")
            }
        })
})

function mostrarOcultarContrasena(num) {

    switch (num) {
        case 0:
            var inputContrasena = document.getElementById("txtClaveActual");
            var iconoMostrarOcultar = document.getElementById("eye" + num);

            if (inputContrasena.type === "password") {
                inputContrasena.type = "text";
                iconoMostrarOcultar.classList.remove("fa-eye");
                iconoMostrarOcultar.classList.add("fa-eye-slash");
            } else {
                inputContrasena.type = "password";
                iconoMostrarOcultar.classList.remove("fa-eye-slash");
                iconoMostrarOcultar.classList.add("fa-eye");
            }
            break;
        case 1:
            var inputContrasena = document.getElementById("txtClaveNueva");

            var iconoMostrarOcultar = document.getElementById("eye" + num);

            if (inputContrasena.type === "password") {
                inputContrasena.type = "text";
                iconoMostrarOcultar.classList.remove("fa-eye");
                iconoMostrarOcultar.classList.add("fa-eye-slash");
            } else {
                inputContrasena.type = "password";
                iconoMostrarOcultar.classList.remove("fa-eye-slash");
                iconoMostrarOcultar.classList.add("fa-eye");
            }
            break;
        case 2:
            var inputContrasena = document.getElementById("txtConfirmarClave");

            var iconoMostrarOcultar = document.getElementById("eye" + num);

            if (inputContrasena.type === "password") {
                inputContrasena.type = "text";
                iconoMostrarOcultar.classList.remove("fa-eye");
                iconoMostrarOcultar.classList.add("fa-eye-slash");
            } else {
                inputContrasena.type = "password";
                iconoMostrarOcultar.classList.remove("fa-eye-slash");
                iconoMostrarOcultar.classList.add("fa-eye");
            }
            break;
        default:
            // código a ejecutar si la expresión no coincide con ningún valor
            break;
    }    
}

function validarContrasena(contrasena) {
    var seguridad = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    return seguridad.test(contrasena);
}