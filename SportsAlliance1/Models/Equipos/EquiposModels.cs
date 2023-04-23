using SportsAlliance_.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace SportsAlliance1.Models.Equipos
{
    public class EquiposModels
    {
        private const string CONEXIONDB = "BD_SportAlliance";

        public EquiposModels()
        {

        }

        #region Obtener la tabla dejugadores
        public String TablaEquipos()
        {
            string sTabla = "";
            string sIdTabla = "";
            string[] aColumnas = new string[] { "NOMBRE", "Color", "Codigó", "Liga", "Deporte", "Director Tecnico", "ACCIONES" };
            string query = "SELECT [idEquipo],te.sNombre,[sColor],[sCodigoEquipo],tl.sNombre, td.sNombre, sNomDirTec" +
                "\r\nFROM [tEquipo] as te" +
                "\r\nInner Join [tLiga] tl ON te.iIdLiga = tl.idLiga" +
                "\r\nInner Join [tDeporte] td ON tl.iIdDeporte = td.idDeporte";
            DataTable dtDatos = new DataTable();
            try
            {
                Conexion cn = new Conexion(CONEXIONDB);
                dtDatos = cn.GetValues(query);
                sIdTabla = "tblEquipos";

                if (dtDatos.Rows.Count >= 0)
                {
                    sTabla += "<table id='" + sIdTabla + "' class='table table-striped table-bordered table-hover dataTable' style='width: 100%'> " +
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
                                string status = "";
                                sTabla += "<tr>";
                                sTabla += "<td>" + oRow[1].ToString() + "</td>";
                                sTabla += "<td>" + oRow[2].ToString() + "</td>";
                                sTabla += "<td>" + oRow[3].ToString() + "</td>";
                                sTabla += "<td>" + oRow[4].ToString() + "</td>";
                                sTabla += "<td>" + oRow[5].ToString() + "</td>";
                                sTabla += "<td>" + oRow[6].ToString() + "</td>";

                                sTabla += "<td >" +
                                                //"<span class='fa fa-eye' style='color:#85c555;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_EditarEquipo(" + oRow[0].ToString() + ");'></span>" +
                                                "<span class='fa fa-pencil-square-o' style='color:#85c555;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_EditEquipo(" + oRow[0].ToString() + ");'></span>" +
                                                 "&nbsp &nbsp" +
                                                "<i class=\"fa fa-duotone fa-trash-can\" style='color:red;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_EliminarEquipo(" + oRow[0].ToString() + ");'></i>" +
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

        #region Obtener los Roles
        public DataTable LlenarComboJugadores()
        {
            DataTable dDatos = new DataTable();
            Conexion cn = new Conexion(CONEXIONDB);
            string query = "select idDeporte, sNombre from tDeporte";
            dDatos = cn.GetValues(query);
            return dDatos;
        }
        #endregion

        #region Obtener los Roles
        public DataTable LlenarComboLiga()
        {
            DataTable dDatos = new DataTable();
            Conexion cn = new Conexion(CONEXIONDB);
            string query = "Select idLiga, sNombre From tLiga";
            dDatos = cn.GetValues(query);
            return dDatos;
        }
        #endregion

        #region Agregar Equipo
        public string AddEquipo(string sNombre, string sClave, string sColor, string sDirector, int iDeporte, int iLiga)
        {
            Conexion cn = new Conexion(CONEXIONDB);
            string sQuery = "Select * from tEquipo" +
                "\r\nwhere sNombre = '" + sNombre + "' and iIdLiga = " + iLiga + " or sNomDirTec= '" + sDirector + "'";
            List<string> sEquipo = new List<string>();
            bool resutl = true;

            sEquipo = cn.RecuperaRegistros(sQuery);
            if (sEquipo.Count == 0)
            {
                string sQuery1 = "INSERT INTO [dbo].[tEquipo]([sNombre],[sColor],[sCodigoEquipo],[iIdLiga],[sNomDirTec])VALUES(" +
                    "'" + sNombre + "','" + sColor + "','" + sClave + "'," + iLiga + ",'" + sDirector + "')";

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

        #region Agregar Equipo
        public List<string> ViewEquipo(string idEquipo)
        {
            Conexion cn = new Conexion(CONEXIONDB);
            string sQuery = "Select * from tEquipo" +
                "\r\nwhere idEquipo=" + idEquipo;
            List<string> lEquipo = new List<string>();
            lEquipo = cn.RecuperaRegistros(sQuery);
            return lEquipo;
        }
        #endregion

        #region Agregar Equipo
        public string EditEquipo(string sNombre, string sClave, string sColor, string sDirector, int iDeporte, int iLiga, int iIdEquipo)
        {
            Conexion cn = new Conexion(CONEXIONDB);
            bool resutl = true;
            string sQuery1 = "UPDATE [dbo].[tEquipo]" +
                "\r\nSET " +
                "\r\n[sNombre]='" + sNombre + "'" +
                ",\r\n[sColor]='" + sColor + "'" +
                ",\r\n[sCodigoEquipo]='" + sClave + "'" +
                ",\r\n[iIdLiga]=" + iLiga +
                ",\r\n[sNomDirTec]='" + sDirector + "'" +
                "\r\nWHERE [idEquipo] = " + iIdEquipo + ";";

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
        public string DeleteEquipo(string idEquipo)
        {
            Conexion cn = new Conexion(CONEXIONDB);
            string sQuery = "Delete from tEquipo" +
                "\r\nwhere idEquipo=" + idEquipo;
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