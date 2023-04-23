using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SistemaVenta.AplicacionWeb.Utilidades.ViewComponents
{
    public class MenuUsuarioViewComponent: ViewComponent
    {

        public async Task<IViewComponentResult> InvokeAsync()
        {
            ClaimsPrincipal claimUser = HttpContext.User;

            string nombreUsuario = "";
            string urlFotoUsuario = "";

            if(claimUser.Identity.IsAuthenticated) {
                nombreUsuario = claimUser.Claims
                    .Where(c => c.Type == ClaimTypes.Name)
                    .Select(c => c.Value).SingleOrDefault();

                urlFotoUsuario = ((ClaimsIdentity)claimUser.Identity).FindFirst("UrlFoto").Value;

            }

            ViewData["nombreUsuario"] = nombreUsuario;

            if (urlFotoUsuario == "")
                urlFotoUsuario = "https://png.pngtree.com/png-vector/20190919/ourlarge/pngtree-user-login-or-authenticate-icon-on-gray-background-flat-icon-ve-png-image_1742031.jpg";

            ViewData["urlFotoUsuario"] = urlFotoUsuario;

            return View();
        }
    }
}
