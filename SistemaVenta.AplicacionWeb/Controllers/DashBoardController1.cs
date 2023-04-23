using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using SistemaVenta.AplicacionWeb.Utilidades.Response;
using SistemaVenta.BLL.Interfaces;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    [Authorize]
    public class DashBoardController1 : Controller
    {
        private readonly IDashBoardService _dashBoardService;


        public DashBoardController1(IDashBoardService dashBoardService)
        {
            _dashBoardService = dashBoardService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerResumen()
        {
            GenericResponse<VMDashBoard> gResponse = new GenericResponse<VMDashBoard>();
            try
            {
                VMDashBoard vmDashBoard = new VMDashBoard();

                vmDashBoard.TotalVentas = await _dashBoardService.TotalVentasUltimaSemana();
                vmDashBoard.TotaIngresos = await _dashBoardService.TotalIngresosUltimaSemana();
                vmDashBoard.TotalProductos = await _dashBoardService.TotalProductos();
                vmDashBoard.ToatalCategorias = await _dashBoardService.TotalCategorias();

                List<VMventasSemana> listaVentasSemana = new List<VMventasSemana>();
                List<VMProductosSemana> listaProductosSemana = new List<VMProductosSemana>();

                foreach(KeyValuePair<string, int> item in await _dashBoardService.VentasUltimaSemana())
                {
                    listaVentasSemana.Add(new VMventasSemana()
                    {
                        Fecha = item.Key,
                        Total = item.Value,
                    });
                }

                foreach (KeyValuePair<string, int> item in await _dashBoardService.VentasUltimaSemana())
                {
                    listaProductosSemana.Add(new VMProductosSemana()
                    {
                        Producto = item.Key,
                        Cantidad = item.Value,
                    });
                }

                vmDashBoard.VentasUltimaSemana = listaVentasSemana;
                vmDashBoard.ProductosTopUltimaSemana = listaProductosSemana;

                gResponse.Estado = true;
                gResponse.Object = vmDashBoard;
            }
            catch (Exception ex){
                gResponse.Estado = false;
                gResponse.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, gResponse);
        }
    }
}
