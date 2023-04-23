using Microsoft.AspNetCore.Mvc;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using SistemaVenta.BLL.Interfaces;
using SistemVentas.Entity;
using Recaptcha.Web.Configuration;
using Recaptcha.Web.Mvc;
using Recaptcha.Web;
using NuGet.Common;
using SistemaVenta.AplicacionWeb.SportsAlliance;
using System.Data;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Security.Cryptography;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    public class AccesoController : Controller
    {
        private readonly IUsuarioService _usuarioService;

        public AccesoController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        public IActionResult Login()
        {
            ClaimsPrincipal claimsUser = HttpContext.User;

            if ( claimsUser.Identity.IsAuthenticated )
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        public IActionResult RestablecerClave()
        {
            
            return View();
        }

        [HttpPost]
        public async Task<string> Login(VMUsuarioLogin modelo)
        {
                Usuario usuario_encontrado = await _usuarioService.ObtenerPorCredenciales(modelo.Correo, modelo.Clave);

                if (usuario_encontrado == null)
                {
                    //ViewData["Mensaje"] = "No se encontraron concidencias";
                    //return View();
                    return "No se encontraron concidencias";
                }

                //ViewData["Mensaje"] = null;

                string token = GenerateToken();

                ConexionDBVentaSQL cn = new ConexionDBVentaSQL();
                string query = "UPDATE [dbo].[Usuario]" +
                    "\r\n   SET [token] = '"+ token + "'" +
                    "\r\n WHERE [correo] ='"+ modelo.Correo + "' and [clave] = '"+ usuario_encontrado.Clave + "'";
                bool respuesta = true;
                respuesta = cn.EjecutaSQL(query);

                ////
                ///
                bool respuesta2 = await EnviarToken(modelo.Correo, token);

                if (respuesta2)
                {
                    //ViewData["Mensaje"] = "Listo, su token fue enviado. \nRevise su correo"; ;
                    //return View();

                    return "Listo, su token fue enviado. \nRevise su correo";
                }
                else
                {
                    //ViewData["Resouesta"] = "Tenemos problemas. \nPor favor inténtelo de nuevo más tarde";
                    //return View();
                    return "Tenemos problemas. \nPor favor inténtelo de nuevo más tarde";
                }


                //List<Claim> claims = new List<Claim>() {
                //    new Claim(ClaimTypes.Name, usuario_encontrado.Nombre),
                //    new Claim(ClaimTypes.NameIdentifier, usuario_encontrado.IdUsuario.ToString()),
                //    new Claim(ClaimTypes.Role, usuario_encontrado.IdRol.ToString()),
                //    new Claim("UrlFoto", usuario_encontrado.UrlFoto),
                //};

                //ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                //AuthenticationProperties properties = new AuthenticationProperties()
                //{
                //    AllowRefresh = true,
                //    IsPersistent = modelo.MantenerSesion
                //};

                //await HttpContext.SignInAsync(
                //    CookieAuthenticationDefaults.AuthenticationScheme,
                //    new ClaimsPrincipal(claimsIdentity),
                //    properties
                //    );

                //return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public async Task<string> ValLogin(string Correo,bool MantenerSesion, string Token)
        {
            //Usuario usuario_encontrado = await _usuarioService.ObtenerPorCredenciales(modelo.Correo, modelo.Clave);

            ConexionDBVentaSQL cn = new ConexionDBVentaSQL();
            string query = "select nombre, idUsuario,idRol, urlFoto " +
                "\r\nfrom [Usuario]" +
                "\r\nwhere correo = '"+ Correo + "' and token = '"+ Token + "'";
            List<string> respuesta = new List<string>();
            respuesta = cn.RecuperaRegistros(query);

            if (respuesta.Count == 0)
            {
                return "Token no valido";
            }

            List<Claim> claims = new List<Claim>() {
                new Claim(ClaimTypes.Name, respuesta[0]),
                new Claim(ClaimTypes.NameIdentifier, respuesta[1].ToString()),
                new Claim(ClaimTypes.Role, respuesta[2].ToString()),
                new Claim("UrlFoto", respuesta[3]),
            };

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            AuthenticationProperties properties = new AuthenticationProperties()
            {
                AllowRefresh = true,
                IsPersistent = MantenerSesion
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                properties
                );

            return "/Home/Index";//RedirectToAction("Index", "Home");
        }


        private string GenerateToken()
        {
            var token = new byte[3];
            using (var randomGenerator = new RNGCryptoServiceProvider())
            {
                randomGenerator.GetBytes(token);
            }
            return BitConverter.ToString(token).Replace("-", "");
        }

        [HttpPost]
        public async Task<bool> EnviarToken(string Correo, string token)
        {
            try
            {
                string urlPlantillaCorreo = $"{this.Request.Scheme}://{this.Request.Host}/Plantilla/EnviarToken?token=[token]";

                bool resultado = await _usuarioService.EnviarToken(Correo, urlPlantillaCorreo, token);

                return resultado;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost]
        public async Task<IActionResult> RestablecerClave(VMUsuarioLogin modelo)
        {
            try
            {
                string urlPlantillaCorreo = $"{this.Request.Scheme}://{this.Request.Host}/Plantilla/RestablecerClave?clave=[clave]";

                bool resultado = await _usuarioService.RestablecerClave(modelo.Correo, urlPlantillaCorreo);

                if(resultado)
                {
                    ViewData["Mensaje"] = "Listo, su contraseña fue restablecida. \nRevise su correo";
                    ViewData["MensajeError"] = null;
                }
                else
                {
                    ViewData["MensajeError"] = "Tenemos problemas. \nPor favor inténtelo de nuevo más tarde"; 
                    ViewData["Mensaje"] = null;
                }
            }catch (Exception ex)
            {
                ViewData["MensajeError"] = ex.Message;
                ViewData["Mensaje"] = null;
            }

            return View();
        }
    }
}
