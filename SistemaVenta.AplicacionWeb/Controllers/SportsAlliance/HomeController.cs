using Microsoft.AspNetCore.Mvc;
using System.Data;
using SistemaVenta.AplicacionWeb.SportsAlliance;


namespace SistemaVenta.AplicacionWeb.Controllers.SportsAlliance
{
    public class HomeController : Controller
    {
        public IActionResult Home()
        {
            return View();
        }

        
    }
}
