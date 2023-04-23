$(document).ready(function () {

    $(".card-body").LoadingOverlay("show");

    fetch("/Negocio/Obtener")
        .then(response => {
            $(".card-body").LoadingOverlay("hide");
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            //console.log(responseJson)

            if (responseJson.estado) {
                const d = responseJson.object

                $("#txtNumeroDocumento").val(d.numeroDocumento)
                $("#txtRazonSocial").val(d.nombre)
                $("#txtCorreo").val(d.correo)
                $("#txtDireccion").val(d.direccion)
                $("#txTelefono").val(d.telefono)
                $("#txtImpuesto").val(d.porcentajeImpuesto)
                $("#txtSimboloMoneda").val(d.simboloMoneda)
                //$("#imgLogo").attr("src", d.urlLogo)
                document.getElementById("imgLogo").src = d.urlLogo;
            } else {
                swal("Lo sentimos", responseJson.mensaje, "error")
            }
        })
})


$("#btnGuardarCambios").click(function () {

    const inputs = $("input.input-validar").serializeArray();
    const inputs_sin_valor = inputs.filter((item) => item.value.trim() == "")

    if (inputs_sin_valor > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        toastr.warning("", mensaje)
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus()
        return;
    }

    if (!validarCorreo($("#txtCorreo").val())) {
        const error = $('<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Por favor de agregar un correo valido</span>');
        $('#txtCorreo').after($(error).fadeOut(2000));
        return;
    }

    const modelo = {
        numeroDocumento: $("#txtNumeroDocumento").val(),
        nombre: $("#txtRazonSocial").val(),
        correo: $("#txtCorreo").val(),
        direccion: $("#txtDireccion").val(),
        telefono: $("#txTelefono").val(),
        porcentajeImpuesto: $("#txtImpuesto").val(),
        simboloMoneda: $("#txtSimboloMoneda").val()
    }

    const inputLogo = document.getElementById("txtLogo")

    const formData = new FormData()

    formData.append("logo", inputLogo.files[0])
    formData.append("modelo", JSON.stringify(modelo))

    $(".card-body").LoadingOverlay("show");

    fetch("/Negocio/GuardarCambios", {
        method: "POST",
        body: formData
    })
        .then(response => {
            $(".card-body").LoadingOverlay("hide");
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {

            if (responseJson.estado) {
                const d = responseJson.objeto

                $("#imgLogo").attr("src", d.urlLogo)

            } else {
                swal("Lo sentimos", responseJson.mensaje, "error")
            }
        })
})


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

function validarCorreo(correo) {
    // Expresión regular para validar el correo electrónico
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Prueba si el correo cumple con el patrón
    return patronCorreo.test(correo);
}

function convertToBase64Img() {
    var archivo = document.getElementById("txtLogo").files[0];
    var reader = new FileReader();
    if (archivo) {

        reader.readAsDataURL(archivo);
        reader.onloadend = function () {
            myString = reader.result;
            document.getElementById("imgLogo").src = reader.result;
        }
    }
}