using SportsAlliance_.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace SportsAlliance1.Models.Index
{
    public class IndexModels
    {
        private const string CONEXIONDB = "BD_SportAlliance";

        public IndexModels()
        {
            //
            // TODO: Agregar aquí la lógica del constructor
            //
        }

        #region Obtener la tabla de Jornadas
        public String TablaJornada(int idLiga)
        {
            string sTabla = "";
            string sIdTabla = "";
            string[] aColumnas = new string[] { "Local", "Gol Local", "Gol Visitante", "Visitante", "Ganador" };
            //string query = "select DISTINCT idJornada, [iJornada],te.sNombre, [iGolesLocal], [iGolesVisitante], teq.sNombre, [iGanador], [iEquipoLocal], [iEquipoVisitante]" +
            //    "\r\nfrom tJornada tj" +
            //    "\r\ninner join tEquipo te on tj.iEquipoLocal = te.idEquipo " +
            //    "\n\rinner join tEquipo teq on tj.iEquipoVisitante = teq.idEquipo"+
            //    "\r\nwhere iLiga = " +idLiga +
            //    "\r\nORDER BY [iJornada]; ";
            string query = "select DISTINCT idJornada, [iJornada],te.sNombre, [iGolesLocal], [iGolesVisitante], teq.sNombre, " +
                "\r\ncase \r\n\tWhen iGanador = 0 Then 'Empate'\r\n\tWhen iGanador = '' Then ''\r\n\tElse tequ.sNombre" +
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
                Conexion cn = new Conexion(CONEXIONDB);
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

        #region Obtener los Roles
        public DataTable LlenarComboLiga()
        {
            DataTable dDatos = new DataTable();
            Conexion cn = new Conexion(CONEXIONDB);
            string query = "Select idLiga, sNombre " +
                "\r\nFrom tLiga tl" +
                "\r\ninner join tJornada tj on tl.idLiga = tj.iLiga" +
                "\r\ngroup by idLiga, sNombre";
            dDatos = cn.GetValues(query);
            return dDatos;
        }
        #endregion
    }
}