using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVenta.AplicacionWeb.Models;
using System.Diagnostics;

using System.Security.Claims;
using AutoMapper;
using SistemaVenta.BLL.Interfaces;
using SistemaVenta.AplicacionWeb.Utilidades.Response;
using SistemaVenta.AplicacionWeb.Models.ViewModels;
using SistemVentas.Entity;
using SistemaVenta.AplicacionWeb.SportsAlliance;
using System.Data;

namespace SistemaVenta.AplicacionWeb.Controllers
{
    //[Authorize]

    public class HomeController : Controller
    {
        //private readonly ILogger<HomeController> _logger;

        private readonly IUsuarioService _usuarioService;
        private readonly IMapper _mapper;

        public HomeController(
            IUsuarioService usuarioService,
            IMapper mapper)
        {
            _usuarioService = usuarioService;
            _mapper = mapper;
        }

        //public HomeController(ILogger<HomeController> logger)
        //{
        //    _logger = logger;
        //}
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        [Authorize]
        public IActionResult Perfil()
        {
            return View();
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> ObtenerUsuario()
        {
            GenericResponse<VMUsuario> response = new GenericResponse<VMUsuario>();

            try
            {
                ClaimsPrincipal claimUser = HttpContext.User;

                string idUsuario = claimUser.Claims
                    .Where(c => c.Type == ClaimTypes.NameIdentifier)
                    .Select(c => c.Value).SingleOrDefault();

                VMUsuario usuario = _mapper.Map<VMUsuario>(await _usuarioService.ObtenerPorId(int.Parse(idUsuario)));

                response.Estado = true;
                response.Object = usuario;
            }
            catch (Exception ex) 
            {
                response.Estado = false;
                response.Mensaje = ex.Message;
            }
            return StatusCode(StatusCodes.Status200OK, response);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GuardarPerfil([FromBody] VMUsuario modelo)
        {
            GenericResponse<VMUsuario> response = new GenericResponse<VMUsuario>();

            try
            {
                ClaimsPrincipal claimUser = HttpContext.User;

                string idUsuario = claimUser.Claims
                    .Where(c => c.Type == ClaimTypes.NameIdentifier)
                    .Select(c => c.Value).SingleOrDefault();

                Usuario entidad = _mapper.Map<Usuario>(modelo);

                entidad.IdUsuario = int.Parse(idUsuario);

                bool resultado = await _usuarioService.GuardarPerfil(entidad);



                response.Estado = resultado;
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Mensaje = ex.Message;
            }
            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpPost]
        public async Task<IActionResult> CambiarClave([FromBody] VMCambiarClave modelo)
        {
            GenericResponse<bool> response = new GenericResponse<bool>();

            try
            {
                ClaimsPrincipal claimUser = HttpContext.User;

                string idUsuario = claimUser.Claims
                    .Where(c => c.Type == ClaimTypes.NameIdentifier)
                    .Select(c => c.Value).SingleOrDefault();

                

                bool resultado = await _usuarioService.CambiarClave(
                    int.Parse(idUsuario),
                    modelo.claveActual,
                    modelo.claveNueva
                    );



                response.Estado = resultado;
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Mensaje = ex.Message;
            }
            return StatusCode(StatusCodes.Status200OK, response);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> Salir()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            //return RedirectToAction("Login","Acceso");
            return RedirectToAction("Home", "Home");
        }

        #region Obtener los Roles
        [HttpPost]
        public string LlenarComboLiga()
        {
            string sRespuesta = "";
            DataTable dDatos = new DataTable();
            ConexionSQL cn = new ConexionSQL();
            string query = "Select idLiga, sNombre " +
                "\r\nFrom tLiga tl" +
                "\r\ninner join tJornada tj on tl.idLiga = tj.iLiga" +
                "\r\ngroup by idLiga, sNombre";
            dDatos = cn.GetValues(query);
            if (dDatos.Rows.Count >= 0 && dDatos != null)
            {
                sRespuesta += "<option selected disabled value=\"\">Elige una Liga</option>";

                foreach (DataRow oRow in dDatos.Rows)
                {
                    sRespuesta += "<option value='" + oRow[0].ToString() + "'>" + oRow[1].ToString() + "</option>";
                }
            }
            else
            {
                sRespuesta += "<option value='0'>No hay Ligas</option>";
            }
            return sRespuesta;
        }
        #endregion

        #region Obtener la tabla de Jornadas
        [HttpPost]
        public String TablaJornada(int idLiga)
        {
            string sTabla = "";
            string sIdTabla = "";
            string[] aColumnas = new string[] { "Local", "Gol Local", "Gol Visitante", "Visitante", "Ganador" };
            string query = "select DISTINCT idJornada, [iJornada],te.sNombre, [iGolesLocal], [iGolesVisitante], teq.sNombre, " +
                "\r\ncase \r\n\tWhen iGanador = 0 Then 'Empate'\r\n\tWhen iGanador = '' Then ''" +
                "\r\n\tElse tequ.sNombre" +
                "\r\nEnd As Ganador, [iEquipoLocal], [iEquipoVisitante]" +
                "\r\nfrom tJornada tj" +
                "\r\ninner join tEquipo te on tj.iEquipoLocal = te.idEquipo " +
                "\r\ninner join tEquipo teq on tj.iEquipoVisitante = teq.idEquipo" +
                "\r\nleft join tEquipo tequ on tj.iGanador = tequ.idEquipo" +
                "\r\nwhere iLiga = " + idLiga +
                "\r\nORDER BY [iJornada]";
            DataTable dtDatos = new DataTable();
            try
            {
                ConexionSQL cn = new ConexionSQL();
                dtDatos = cn.GetValues(query);
                sIdTabla = "tblJornadas";
                int iMayor = 0;

                if (dtDatos.Rows.Count >= 0)
                {
                    foreach (DataRow oRow in dtDatos.Rows)
                    {
                        if (Int32.Parse(oRow[1].ToString()) > iMayor)
                        {
                            iMayor = Int32.Parse(oRow[1].ToString());
                        }
                    }

                    for (int i = 1; i <= iMayor; i++)
                    {
                        sTabla += "<div> <h1> Jornada " + i + " </h1></div>" +
                                "<table id='" + sIdTabla + "' class='display table table-striped table-bordered table-hover dataTable'  style='width: 95%'> " +
                            "<thead>" +
                            "<tr>";

                        foreach (string sColumna in aColumnas)
                        {
                            sTabla += "<th>" + sColumna + "</th>";
                        }
                        sTabla += "</tr></thead>";
                        sTabla += "<tbody>";
                        foreach (DataRow oRow in dtDatos.Rows)
                        {

                            if (i == Int32.Parse(oRow[1].ToString()))
                            {
                                sTabla += "<tr>";
                                sTabla += "<td>" + oRow[2].ToString() + "</td>";
                                sTabla += "<td>" + oRow[3].ToString() + "</td>";
                                sTabla += "<td>" + oRow[4].ToString() + "</td>";
                                sTabla += "<td>" + oRow[5].ToString() + "</td>";
                                sTabla += "<td>" + oRow[6].ToString() + "</td>";
                                sTabla += "</tr>";
                            }
                        }
                        sTabla += "</table>";
                    }
                }
            }
            catch (Exception ex)
            {
                sTabla = "-1";
            }
            return sTabla;
        }
        #endregion


        #region metodo que genera las tablas de pocisiones
        [HttpPost]
        public string TablaPos(int idLiga)
        {
            string sTabla = "";
            string sIdTabla = "tblPuntos";
            string[] aColumnas = new string[] { "Equipo", "PJ", "PG", "PP", "PE", "GAF", "GEC", "DDF", "PTS", "PP" };
            ConexionSQL cn = new ConexionSQL();
            string query = "SELECT t1.*, " +
                "\r\n    (SELECT COUNT(DISTINCT t2.Puntos +  t2.DiferenciaDeGoles +  t2.GolesAFavor) + 1" +
                "\r\n     FROM tb_Puntos1 t2 " +
                "\r\n     WHERE t2.Puntos > t1.Puntos " +
                "\r\n        OR (t2.puntos = t1.puntos " +
                "\r\n            AND (t2.DiferenciaDeGoles > t1.DiferenciaDeGoles " +
                "\r\n                 OR (t2.DiferenciaDeGoles = t1.DiferenciaDeGoles AND t2.GolesAFavor > t1.GolesAFavor))))" +
                "\r\n        AS puntosInpa" +
                "\r\nFROM tb_Puntos1 t1" +
                "\r\nwhere iIdLiga = " + idLiga +
                "\r\nORDER BY t1.Puntos DESC, t1.DiferenciaDeGoles DESC, t1.GolesAFavor DESC";
            DataTable dtDatos = new DataTable();
            dtDatos = cn.GetValues(query);
            string Val = "";

            if (dtDatos.Rows.Count >= 0)
            {
                sTabla += "<table id='" + sIdTabla + "' class='table table-striped table-bordered table-hover dataTable' style='width: 10%'> " +
                            "<thead>" +
                            "<tr>";
                foreach (string sColumna in aColumnas)
                {
                    sTabla += "<th>" + sColumna + "</th>";
                }
                sTabla += "</tr></thead>";
                sTabla += "<tbody>";
                if (dtDatos != null)
                {
                    if (dtDatos.Rows.Count > 0)
                    {
                        foreach (DataRow oRow in dtDatos.Rows)
                        {
                            sTabla += "<tr>";
                            sTabla += "<td>" + oRow[0].ToString() + "</td>";
                            sTabla += "<td>" + oRow[1].ToString() + "</td>";
                            sTabla += "<td>" + oRow[2].ToString() + "</td>";
                            sTabla += "<td>" + oRow[3].ToString() + "</td>";
                            sTabla += "<td>" + oRow[4].ToString() + "</td>";
                            sTabla += "<td>" + oRow[5].ToString() + "</td>";
                            sTabla += "<td>" + oRow[6].ToString() + "</td>";
                            sTabla += "<td>" + oRow[7].ToString() + "</td>";
                            sTabla += "<td>" + oRow[8].ToString() + "</td>";
                            sTabla += "<td>" + oRow[10].ToString() + "</td>";
                            sTabla += "</tr>";
                        }
                    }
                }
                sTabla += "</tbody>";
                sTabla += "<tfoot>" +
                        "<tr>";
                sTabla += "</tr>" +
                            "</tfoot>" +
                        "</table>";
            }

            return sTabla;
        }
        #endregion
    }
}