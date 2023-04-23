using Microsoft.AspNetCore.Mvc;

using AutoMapper;
using Newtonsoft.Json;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using SistemaVenta.AplicacionWeb.Utilidades.Response;
using SistemaVenta.BLL.Interfaces;
using SistemVentas.Entity;
using SistemaVenta.BLL.Implementacion;
using Microsoft.AspNetCore.Authorization;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    [Authorize]

    public class ProductosController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IProductoService _productoService;

        public ProductosController(IMapper mapper,
            IProductoService productoService)
        {
            _mapper = mapper;
            _productoService = productoService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<VMProducto> vmProductoLista = _mapper.Map<List<VMProducto>>(await _productoService.Lista());
            return StatusCode(StatusCodes.Status200OK, new { data = vmProductoLista });
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromForm] IFormFile imagen, [FromForm] string modelo)
        {
            GenericResponse<VMProducto> gRespose = new GenericResponse<VMProducto>();

            try
            {
                VMProducto vmProducto = JsonConvert.DeserializeObject<VMProducto>(modelo);

                string nombreImagen = "";
                Stream imagenStream = null;

                if (imagen != null)
                {
                    string nombre_en_codigo = Guid.NewGuid().ToString("N");
                    string extension = Path.GetExtension(imagen.FileName);
                    nombreImagen = string.Concat(nombre_en_codigo, extension);
                    imagenStream = imagen.OpenReadStream();
                }

                Producto producto_creado = await _productoService.Crear(_mapper.Map<Producto>(vmProducto), imagenStream, nombreImagen);
                vmProducto = _mapper.Map<VMProducto>(producto_creado);

                gRespose.Estado = true;
                gRespose.Object = vmProducto;
            }
            catch (Exception ex)
            {
                gRespose.Estado = false;
                gRespose.Mensaje = ex.Message;
            }
            return StatusCode(StatusCodes.Status200OK, gRespose);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromForm] IFormFile imagen, [FromForm] string modelo)
        {
            GenericResponse<VMProducto> gRespose = new GenericResponse<VMProducto>();

            try
            {
                VMProducto vmProducto = JsonConvert.DeserializeObject<VMProducto>(modelo);

                string nombreImagen = "";
                Stream imagenStream = null;

                if (imagen != null)
                {
                    string nombre_en_codigo = Guid.NewGuid().ToString("N");
                    string extension = Path.GetExtension(imagen.FileName);
                    nombreImagen = string.Concat(nombre_en_codigo, extension);
                    imagenStream = imagen.OpenReadStream();
                }

                Producto producto_editado = await _productoService.Editar(_mapper.Map<Producto>(vmProducto), imagenStream, nombreImagen);
                vmProducto = _mapper.Map<VMProducto>(producto_editado);

                gRespose.Estado = true;
                gRespose.Object = vmProducto;
            }
            catch (Exception ex)
            {
                gRespose.Estado = false;
                gRespose.Mensaje = ex.Message;
            }
            return StatusCode(StatusCodes.Status200OK, gRespose);
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int IdProducto)
        {
            GenericResponse<string> gRespose = new GenericResponse<string>();

            try
            {
                gRespose.Estado = await _productoService.Eliminar(IdProducto);
            }
            catch (Exception ex)
            {
                gRespose.Estado = false;
                gRespose.Mensaje = ex.Message;
            }
            return StatusCode(StatusCodes.Status200OK, gRespose);
        }
    }
}