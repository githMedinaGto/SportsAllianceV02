using Microsoft.AspNetCore.Mvc;
using SistemaVenta.AplicacionWeb.Models.ViewModels;


using AutoMapper;
using SistemaVenta.BLL.Interfaces;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    public class PlantillaController : Controller
    {
        private readonly IMapper _mapper;
        private readonly INegocioService _negocioServie;
        private readonly IVentaService _ventaService;

        public PlantillaController(IMapper mapper, INegocioService negocioServie, IVentaService ventaService)
        {
            _mapper = mapper;
            _negocioServie = negocioServie;
            _ventaService = ventaService;
        }

        public IActionResult EnviarClave(string correo, string clave)
        {
            ViewData["Correo"] = correo;
            ViewData["Clave"]  = clave;
            ViewData["Url"] = $"{this.Request.Scheme}//{this.Request.Host}";
            return View();
        }

        public async Task<IActionResult> PDFVenta(string numeroVenta)
        {
            VMVenta vmVenta = _mapper.Map<VMVenta>(await _ventaService.Detalle(numeroVenta));
            VMNegocio vmNegocio = _mapper.Map<VMNegocio>(await _negocioServie.Obtener());

            VMPDFventa modelo = new VMPDFventa();

            modelo.negocio = vmNegocio;
            modelo.venta = vmVenta;

            return View(modelo);
        }

        public IActionResult RestablecerClave(string clave)
        {
            ViewData["Clave"] = clave;
            return View();
        }

        public IActionResult EnviarToken(string token)
        {
            ViewData["Token"] = token;
            return View();
        }
    }
}
