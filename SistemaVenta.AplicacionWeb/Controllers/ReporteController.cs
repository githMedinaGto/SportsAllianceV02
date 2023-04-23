using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using SistemaVenta.BLL.Interfaces;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    [Authorize]

    public class ReporteController : Controller
    {

        private readonly IMapper _mapper;
        private IVentaService _ventaService;

        public ReporteController(
            Mapper mapper,
            IVentaService ventaService)
        {
            _mapper = mapper;
            _ventaService = ventaService;

        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ReporteVenta(string fechaInicio, string fechaFin)
        {
            List<VMReporteVentas> vmLista = _mapper.Map<List<VMReporteVentas>>(await _ventaService.Reporte(fechaInicio,fechaFin));
            return StatusCode(StatusCodes.Status200OK, new { data =  vmLista });
        }
    }
}
