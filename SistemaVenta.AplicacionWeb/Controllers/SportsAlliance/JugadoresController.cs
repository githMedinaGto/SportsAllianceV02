using Firebase.Auth;
using Firebase.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVenta.AplicacionWeb.SportsAlliance;
using System.Data;

namespace SistemaVenta.AplicacionWeb.Controllers.SportsAlliance
{
    [Authorize]
    public class JugadoresController : Controller
    {
        public IActionResult Jugadores()
        {
            return View();
        }

        #region Obtener los Roles
        [HttpPost]
        public string LlenarComboEquipos()
        {
            string sRespuesta = "";
            DataTable dDatos = new DataTable();
            ConexionSQL cn = new ConexionSQL();
            string query = "select idEquipo, sNombre from tEquipo";
            dDatos = cn.GetValues(query);

            if (dDatos.Rows.Count >= 0 && dDatos != null)
            {
                sRespuesta += "<option value='0'>Elige un equipo</option>";

                foreach (DataRow oRow in dDatos.Rows)
                {
                    sRespuesta += "<option value='" + oRow["idEquipo"].ToString() + "'>" + oRow["sNombre"].ToString() + "</option>";
                }
            }
            else
            {
                sRespuesta += "<option value='0'>No hay equipos</option>";
            }
            return sRespuesta;
        }
        #endregion

        #region Obtener la tabla dejugadores
        [HttpPost]
        public string TablaJugadores(int idEquipo)
        {
            string sTabla = "";
            string sIdTabla = "";
            string[] aColumnas = new string[] { "NOMBRE", "Apodo", "FECHA DE NACIMIENTO", "POSICIÓN", "DORSAL", "ACCIONES" };
            string query = "select idJugador, sNombre, sApodo, dFechaNacimiento, sPosicion, iDorsal" +
                "\r\n  from tRegistroJugadores" +
                "\r\n  where iIdEquipo =" + idEquipo;
            DataTable dtDatos = new DataTable();
            try
            {
                ConexionSQL cn = new ConexionSQL();
                dtDatos = cn.GetValues(query);
                sIdTabla = "tblJugadores";

                if (dtDatos.Rows.Count >= 0)
                {
                    sTabla += "<table id='" + sIdTabla + "' class='table table-striped table-bordered table-hover dataTable' style='width: 100%'> " +
                            "<thead>" +
                            "<tr>";
                    foreach (string sColumna in aColumnas)
                    {
                        sTabla += "<th scope=\"col\">" + sColumna + "</th>";
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
                                sTabla += "<td>" + oRow[1].ToString() + "</td>";
                                sTabla += "<td>" + oRow[2].ToString() + "</td>";
                                char[] delimiterChars = { '/', ' ', '\t' };
                                string[] aDate = oRow[3].ToString().Split(delimiterChars);
                                sTabla += "<td>" + aDate[2] + "-" + aDate[1] + "-" + aDate[0] + "</td>";
                                sTabla += "<td>" + oRow[4].ToString() + "</td>";
                                sTabla += "<td>" + oRow[5].ToString() + "</td>";

                                sTabla += "<td >" +
                                                //"<span class='fa fa-eye' style='color:#85c555;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_EditarEquipo(" + oRow[0].ToString() + ");'></span>" +
                                                "<span class='fa fa-pencil-square-o' style='color:#85c555;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_EditJugador(" + oRow[0].ToString() + ");'></span>" +
                                                 "&nbsp &nbsp" +
                                                "<i class=\"fa fa-duotone fa-trash-can\" style='color:red;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_ElimJugador(" + oRow[0].ToString() + ");'></i>" +
                                           "</td>";
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
            }
            catch (Exception ex)
            {
                sTabla = "-1";
            }
            return sTabla;
        }
        #endregion

        #region Agregar Jugador
        [HttpPost]
        public async Task<string> InsertarJugador(string sNombreCom, string sEquipo, string sApodo, int iDorsal, string sFecha, string sFoto, string sPosicion)
        {
            ConexionSQL cn = new ConexionSQL();
            string sQuery = "select * from tRegistroJugadores\r\n  where sNombre = '" + sNombreCom + "' ";
            List<string> sJugador = new List<string>();
            bool resutl = true;

            sJugador = cn.RecuperaRegistros(sQuery);
            if (sJugador.Count == 0)
            {

                string sQuery1 = "INSERT INTO [dbo].[tRegistroJugadores]([sNombre],[sApodo],[dFechaNacimiento],[sPosicion],[iDorsal],[sFoto],[iIdEquipo])" +
                    "\r\nVALUES('" + sNombreCom + "','" + sApodo + "','" + sFecha + "','" + sPosicion + "'," + iDorsal + ",'" + sFoto + "'," + sEquipo + ")";

                resutl = cn.EjecutaSQL(sQuery1);
                if (!resutl)
                {
                    return "2";
                }
                else
                {
                    return "0";
                }
            }
            else
            {
                return "1";
            }
        }
        #endregion

        #region Ver Jugador
        [HttpPost]
        public List<string> VerJugador(int idJugador)
        {
            ConexionSQL cn = new ConexionSQL();
            string sQuery = "SELECT [idJugador],[sNombre],[sApodo],[dFechaNacimiento],[sPosicion],[iDorsal],[sFoto],[iIdEquipo]" +
                            "FROM [BD_SportAlliance].[dbo].[tRegistroJugadores]" +
                            "WHERE idJugador = " + idJugador;
            return cn.RecuperaRegistros(sQuery);
        }
        #endregion

        #region Acualizar Jugador
        [HttpPost]
        public string ActualizarJugador(string sNombreCom, string sEquipo, string sApodo, int iDorsal, string sFecha, string sFoto, string sPosicion, int iIdJugador)
        {
            ConexionSQL cn = new ConexionSQL();
            bool resutl = true;
            string sQuery1 = "UPDATE [dbo].[tRegistroJugadores]\r\n   " +
                "SET [sNombre] = '" + sNombreCom + "'\r\n      " +
                ",[sApodo] = '" + sApodo + "'\r\n      " +
                ",[dFechaNacimiento] = '" + sFecha + "'\r\n      " +
                ",[sPosicion] = '" + sPosicion + "'\r\n      " +
                ",[iDorsal] = " + iDorsal +
                "\r\n,[sFoto] = '" + sFoto + "'\r\n      " +
                ",[iIdEquipo] = " + sEquipo +
                "\r\nWHERE idJugador = " + iIdJugador;
            resutl = cn.EjecutaSQL(sQuery1);
            if (!resutl)
            {
                return "2";
            }
            else
            {
                return "0";
            }
        }
        #endregion

        #region Agregar Equipo
        [HttpPost]
        public string EliminarJugador(int idJugador)
        {
            ConexionSQL cn = new ConexionSQL();
            string sQuery = "Delete from tRegistroJugadores" +
                "\r\nwhere idJugador=" + idJugador;
            bool resutl = true;
            resutl = cn.EjecutaSQL(sQuery);
            if (!resutl)
            {
                return "2";
            }
            else
            {
                return "0";
            }
        }
        #endregion

    }
}
