var sCorreo;
var sClave;
let valorCheckbox;
function mostrarOcultarContrasena() {

    var inputContrasena = document.getElementById("txtClave");
    var iconoMostrarOcultar = document.getElementById("eye");

    if (inputContrasena.type === "password") {
        inputContrasena.type = "text";
        iconoMostrarOcultar.classList.remove("fa-eye");
        iconoMostrarOcultar.classList.add("fa-eye-slash");
    } else {
        inputContrasena.type = "password";
        iconoMostrarOcultar.classList.remove("fa-eye-slash");
        iconoMostrarOcultar.classList.add("fa-eye");
    }

}

$(document).ready(function () {
    $("#btnInit").click(function () {
        fn_Ingresar();
        //setTimeout(() => {
            //$("#ModalToken").modal("show");
        //}, 3000);

    });
})

function fn_Ingresar() {
    //$.blockUI({ message: '<h1><img class="manImg" src="../../Assets/reload-cat.gif" alt="Image" height="65" width="65"/> Cargando...</h1>' });
    $("#page-top").LoadingOverlay("show");
    sCorreo = $("#txtCorreo").val();
    sClave = $("#txtClave").val();

    if (sCorreo == "" || sClave == "") {
        let miDiv = document.getElementById("mi-div");
        let miSpan = document.getElementById("mensaje");

        miSpan.innerHTML = "Favor de ingresar usaurio y/o contraseña";
        miDiv.classList.add("alert-danger");

        // Revertir el contenido después de 3 segundos
        setTimeout(function () {
            miDiv.classList.remove("alert-danger");
            miSpan.innerHTML = "";
        }, 3000);
        $("#page-top").LoadingOverlay("hide");
        return;
    }

    let checkbox = document.getElementById("chkMantenerSesion");
    valorCheckbox = checkbox.checked;

    let captchaResponse = grecaptcha.getResponse();

    if (captchaResponse.length > 0) {
        $.ajax({
            url: "/Acceso/Login",
            type: "POST",
            data: {
                'Clave': sClave,
                'Correo': sCorreo,
                'MantenerSesion': valorCheckbox
            },
            success: function (data) {
                let palabraABuscarUsu = "concidencias";
                if (data.includes(palabraABuscarUsu)) {

                    let miDiv = document.getElementById("mi-div");
                    let miSpan = document.getElementById("mensaje");

                    miSpan.innerHTML = data;
                    miDiv.classList.add("alert-danger");

                    // Revertir el contenido después de 3 segundos
                    setTimeout(function () {
                        miDiv.classList.remove("alert-danger");
                        miSpan.innerHTML = "";
                    }, 3000);
                    $("#page-top").LoadingOverlay("hide");
                } else {
                    let miSpan = document.getElementById("mensajeToken");
                    miSpan.innerHTML = data;
                    $("#ModalToken").modal("show");
                    $("#page-top").LoadingOverlay("hide");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                
                $("#page-top").LoadingOverlay("hide");
                $.growl.error({ message: textStatus });
            }
        });
    } else {
        let miDiv = document.getElementById("mi-div");
        let miSpan = document.getElementById("mensaje");

        miSpan.innerHTML = "Favor de validar el CAPTCHA";
        miDiv.classList.add("alert-danger");

        // Revertir el contenido después de 3 segundos
        setTimeout(function () {
            miDiv.classList.remove("alert-danger");
            miSpan.innerHTML = "";
        }, 3000);
        $("#page-top").LoadingOverlay("hide");
    }
    $("#page-top").LoadingOverlay("hide");
}

function fn_AValidar() {
    $("#page-top").LoadingOverlay("show");
    var sToken = $("#txtToken").val();

    if (sToken == "") {
        var error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">Favor de agregar el token</span>';
        $('#txtToken').after($(error).fadeOut(2000));
        return;
    }

    $.ajax({
        url: "/Acceso/ValLogin",
        type: "POST",
        data: {
            'Correo': sCorreo,
            'MantenerSesion': valorCheckbox,
            'Token': sToken
        },
        success: function (data) {
            let palabraABuscarUsu = "Token";
            if (data.includes(palabraABuscarUsu)) {

                var error = '<span style="color: red; font-family: Helvetica, Arial, sans-serif;">'+data+'</span>';
                $('#txtToken').after($(error).fadeOut(2000));
                $("#page-top").LoadingOverlay("hide");
            } else {
                $("#page-top").LoadingOverlay("hide");
                window.location.href = data;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#page-top").LoadingOverlay("hide");
            $.growl.error({ message: textStatus });
        }
    });
    $("#page-top").LoadingOverlay("hide");
}