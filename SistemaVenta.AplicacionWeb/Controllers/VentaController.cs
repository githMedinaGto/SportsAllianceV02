using Microsoft.AspNetCore.Mvc;

using AutoMapper;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using SistemaVenta.AplicacionWeb.Utilidades.Response;
using SistemaVenta.BLL.Interfaces;
using SistemVentas.Entity;
using SistemaVentas.BLL.Interfaces;

using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Authorization;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    [Authorize]
    public class VentaController : Controller
    {
        private readonly ITipoDocumentoVentaService _tipoDocumentoVentaService;
        private readonly IVentaService _ventaService;
        private readonly IMapper _mapper;
        private readonly IConverter _converter;  

        public VentaController(ITipoDocumentoVentaService tipoDocumentoVentaService,
            IVentaService ventaService,
            IMapper mapper, IConverter converter
            )
        {
            _tipoDocumentoVentaService = tipoDocumentoVentaService;
            _ventaService = ventaService;
            _mapper = mapper;
            _converter = converter;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult NuevaVenta()
        {
            return View();
        }
        public IActionResult HistorialVenta()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ListaTipoDocumentoVenta()
        {
            List<VMTipoDocumentoVenta> vmListaTipoDocuento = _mapper.Map<List<VMTipoDocumentoVenta>>(await _tipoDocumentoVentaService.Lista());
            return StatusCode(StatusCodes.Status200OK, vmListaTipoDocuento);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerProductos(string busqueda)
        {
            List<VMProducto> vmListaProducto = _mapper.Map<List<VMProducto>>(await _ventaService.ObtenerProducto(busqueda));
            return StatusCode(StatusCodes.Status200OK, vmListaProducto);
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarVenta([FromForm] VMVenta modelo)
        {
            GenericResponse<VMVenta> gResponse = new GenericResponse<VMVenta>();

            try
            {
                modelo.IdUsuario = 1;
                Venta venta_creada = await _ventaService.Registrar(_mapper.Map<Venta>(modelo));
                modelo = _mapper.Map<VMVenta>(venta_creada);

                gResponse.Estado = true;
                gResponse.Object = modelo;
            }
            catch (Exception ex)
            {
                gResponse.Estado = false;
                gResponse.Mensaje = ex.Message;
            }


            return StatusCode(StatusCodes.Status200OK, gResponse);
        }

        [HttpGet]
        public async Task<IActionResult> Historial(string numeroVenta, string fechaInicio, string fechaFin)
        {
            List<VMVenta> vmHistorialVenta = _mapper.Map<List<VMVenta>>(await _ventaService.Historial(numeroVenta, fechaInicio, fechaFin));

            return StatusCode(StatusCodes.Status200OK, vmHistorialVenta);
        }

        public IActionResult MostrarPDFVenta(string numeroVenta)
        {
            string urlPlantillaVista = $"{this.Request.Scheme}://{this.Request.Host}/Plantilla/PDFVenta?numeroVenta={numeroVenta}";

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = new GlobalSettings()
                {
                    PaperSize = PaperKind.A4,
                    Orientation = Orientation.Portrait,
                },
                Objects =
                {
                    new ObjectSettings()
                    {
                        Page = urlPlantillaVista
                    }
                }
            };

            var archivoPDF = _converter.Convert(pdf);

            return File(archivoPDF, "application/pdf");
        }
    }
}
