using SportsAlliance_.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace SportsAlliance1.Models.Liga
{
    public class LigaModels
    {
        private const string CONEXIONDB = "BD_SportAlliance";

        public LigaModels() { }

        #region Obtener la tabla de ligas
        public String TablaLiga()
        {
            string sTabla = "";
            string query = "SELECT [idLiga]\r\n,[sNombre]\r\n FROM [BD_SportAlliance].[dbo].[tLiga]";
            DataTable dtDatos = new DataTable();
            try
            {
                Conexion cn = new Conexion(CONEXIONDB);
                dtDatos = cn.GetValues(query);

                if (dtDatos.Rows.Count >= 0)
                {
                    if (dtDatos != null)
                    {
                        if (dtDatos.Rows.Count > 0)
                        {
                            foreach (DataRow oRow in dtDatos.Rows)
                            {
                                sTabla += "<div class=\"col-md-2 text-center\">" +
                                    "\r\n<a style=\"color:#3385d9\" onclick='javascript:fn_EditLiga(" + oRow[0].ToString() + ");'>" +
                                    "\r\n<span style=\"font-size: 6em; cursor: pointer;\">" +
                                    "\r\n<i style=\"color: gold;\" class=\"fa fa-duotone fa-trophy\"></i>" +
                                    "\r\n<h6 style=\"font-size: 30px; text-decoration: underline;\">" + oRow[1].ToString() + "</h6>" +
                                    "\r\n</span>" +
                                    "\r\n</a>" +
                                    "\r\n</div>";
                            }
                        }
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

        #region Obtener la tabla de ligas
        public List<string> SelectLiga(int idLiga)
        {
            List<string> lsDatos = new List<string>();
            string query = "SELECT * \r\n FROM [BD_SportAlliance].[dbo].[tLiga]\r\n where [idLiga]=" + idLiga;
            Conexion cn = new Conexion(CONEXIONDB);
            lsDatos = cn.RecuperaRegistros(query);
            return lsDatos;
        }
        #endregion

        #region Obtener la tabla dejugadores
        public String TablaEquipos(int idLiga)
        {
            string sTabla = "";
            string sIdTabla = "";
            string[] aColumnas = new string[] { "NOMBRE", "Color", "Codigó", "Liga", "Deporte", "Director Tecnico", "ACCIONES" };
            string query = "SELECT [idEquipo],te.sNombre,[sColor],[sCodigoEquipo],tl.sNombre, td.sNombre, sNomDirTec" +
                "\r\nFROM [tEquipo] as te" +
                "\r\nInner Join [tLiga] tl ON te.iIdLiga = tl.idLiga" +
                "\r\nInner Join [tDeporte] td ON tl.iIdDeporte = td.idDeporte" +
                "\r\nWhere tl.idLiga=" + idLiga;
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

        #region Obtener los Deportes
        public DataTable LlenarComboDeportes()
        {
            DataTable dDatos = new DataTable();
            Conexion cn = new Conexion(CONEXIONDB);
            string query = "SELECT [idDeporte]\r\n      " +
                ",[sNombre]\r\n  " +
                "FROM [BD_SportAlliance].[dbo].[tDeporte]";
            dDatos = cn.GetValues(query);
            return dDatos;
        }
        #endregion

        #region Agregar Liga
        public string AddLiga(string sNombre, int iDeporte, int iCategoria)
        {
            Conexion cn = new Conexion(CONEXIONDB);
            string sQuery = "SELECT * FROM [BD_SportAlliance].[dbo].[tLiga]  Where sNombre= '" + sNombre + "' and iIdDeporte =" + iDeporte + "and iCategoria = " + iCategoria;
            List<string> sJugador = new List<string>();
            bool resutl = true;

            sJugador = cn.RecuperaRegistros(sQuery);
            if (sJugador.Count == 0)
            {
                string sQuery1 = "INSERT INTO [dbo].[tLiga] ([sNombre],[iIdDeporte],[iCategoria])" +
                    "\r\nVALUES ('" + sNombre + "'," + iDeporte + "," + iCategoria + ")";

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

        #region Iniciar liga
        public string InitLiga(int iIdLiga)
        {
            DataTable dt = new DataTable();
            List<string> data = new List<string>();
            List<DtListJuegos> oJuegos = new List<DtListJuegos>();
            int numParJornadas;
            int numCantFec;
            List<DtListJuegos> mazo = new List<DtListJuegos>();
            int iJornada = 0;
            int iJornadaRe = 0;
            int iLigas; //Valida si ya existe la jornada creada con la liga 
            List<DtListJuegos> NumJuego = new List<DtListJuegos>();
            Conexion cn = new Conexion(CONEXIONDB);
            string sQueryIns = "";
            bool resutl = true;
            string numQuery = "select Count(idJornada) from [dbo].[tJornada]\r\nwhere iJornada =" + iIdLiga;

            iLigas = cn.RecuperaValornum(numQuery);
            List<DtListJuegos> res = new List<DtListJuegos>();

            if (iLigas != 0)
            {
                return "-1";
            }
            else
            {
                string query = "SELECT [idEquipo]" +
                "\r\nFROM [tEquipo] as te" +
                "\r\nInner Join [tLiga] tl ON te.iIdLiga = tl.idLiga" +
                "\r\nInner Join [tDeporte] td ON tl.iIdDeporte = td.idDeporte" +
                "\r\nWhere tl.idLiga=" + iIdLiga;
                data = cn.RecuperaRegistros(query);
                if (data.Count() % 2 == 0)
                {
                    List<string> barajadecartas = data;
                    List<string> valordecartas = data;
                    numParJornadas = (data.Count()) / 2;


                    barajadecartas.ForEach(b => {
                        valordecartas.ForEach(v => {
                            mazo.Add(new DtListJuegos(b, v, "", "", "", "", ""));
                        });
                    });

                    mazo.ForEach(i => {
                        if (i.Local != i.Visitante)
                        {
                            oJuegos.Add(new DtListJuegos(i.Local, i.Visitante, "", "", "", "", ""));
                        }
                    });

                    numCantFec = oJuegos.Count() / 2;
                    iJornadaRe = numCantFec;

                    oJuegos.ForEach(i => {
                        if (iJornada < numCantFec)
                        {
                            iJornada++;
                            sQueryIns += "\r\nINSERT INTO [dbo].[tJornada] ([iEquipoLocal],[iEquipoVisitante],[iJornada],[iLiga])\r\n" +
                            "VALUES (" + i.Local + "," + i.Visitante + "," + iJornada + "," + iIdLiga + ");";
                            NumJuego.Add(new DtListJuegos(i.Local, i.Visitante, iJornada.ToString(), iIdLiga.ToString(), "", "", ""));
                        }
                        else
                        {
                            sQueryIns += "\r\nINSERT INTO [dbo].[tJornada] ([iEquipoLocal],[iEquipoVisitante],[iJornada],[iLiga])\r\n" +
                            "VALUES (" + i.Local + "," + i.Visitante + "," + iJornadaRe + "," + iIdLiga + ");";
                            NumJuego.Add(new DtListJuegos(i.Local, i.Visitante, iJornadaRe.ToString(), iIdLiga.ToString(), "", "", ""));
                            iJornadaRe--;
                        }
                    });

                    resutl = cn.EjecutaSQL(sQueryIns);
                    if (!resutl)
                    {
                        return "-3";
                    }
                    else
                    {
                        return "0";
                    }

                    //return NumJuego;
                }
                else
                {
                    return "-2";
                }

            }


        }
        #endregion

        #region Obtener la tabla de Jornadas
        public String TablaJornada(int idLiga)
        {
            string sTabla = "";
            string sIdTabla = "";
            string[] aColumnas = new string[] { "Local", "Gol Local", "Gol Visitante", "Visitante", "Ganador", "ACCIONES" };
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
                                if (oRow[6].ToString() == "")
                                {
                                    sTabla += "<td><input type=\"text\" class=\"form-control\" onkeypress=\"return permite(event, 'num')\" id=\"golLocal" + oRow[0].ToString() + "\" name=\"golLocal\" required\r\n value=\"" + oRow[3].ToString() + "\" size=\"2\"></td>";
                                    sTabla += "<td><input type=\"text\" class=\"form-control\" onkeypress=\"return permite(event, 'num')\" id=\"golVisitante" + oRow[0].ToString() + "\" name=\"golVisitante\" required\r\n value=\"" + oRow[4].ToString() + "\" size=\"2\"></td>";

                                }
                                else
                                {
                                    sTabla += "<td>" + oRow[3].ToString() + "</td>";
                                    sTabla += "<td>" + oRow[4].ToString() + "</td>";

                                }
                                sTabla += "<td>" + oRow[5].ToString() + "</td>";
                                sTabla += "<td>" + oRow[6].ToString() + "</td>";
                                if (oRow[6].ToString() == "")
                                {
                                    sTabla += "<td >" +
                                    "<span class='fa fa-pencil-square-o' style='color:#85c555;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_EditGol(" + oRow[0].ToString() + ");'></span>" +
                                    "&nbsp &nbsp" +
                                    "<i class=\"fa fa-solid fa-list-check\" style='color:darkblue;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_FinJuego(" + oRow[0].ToString() + "," + oRow[7].ToString() + "," + oRow[8].ToString() + ");'></i>" +
                                    "</td>";
                                }
                                else
                                {
                                    sTabla += "<td style=\"pointer-events: none;\r\n    opacity: 0.45;\">" +
                                    "<span class='fa fa-pencil-square-o' style='color:#85c555;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_EditGol(" + oRow[0].ToString() + ");'></span>" +
                                    "&nbsp &nbsp" +
                                    "<i class=\"fa fa-solid fa-list-check\" style='color:darkblue;font-size: 35px;  cursor: pointer;' onclick='javascript:fn_FinJuego(" + oRow[0].ToString() + "," + oRow[7].ToString() + "," + oRow[8].ToString() + ");'></i>" +
                                    "</td>";
                                }

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

        #region Agregar los goles de cada partido
        public string actGoles(string iIdPartido, string iGolLocal, string iGolVisitante)
        {
            Conexion cn = new Conexion(CONEXIONDB);
            bool resutl = true;
            string sQuery = "";
            if (iGolLocal != "" && iGolVisitante != "")
            {
                sQuery = "UPDATE [tJornada]" +
                "\r\nSET [iGolesLocal] = " + iGolLocal +
                ",\r\n [iGolesVisitante]=" + iGolVisitante +
                "\r\nWHERE [idJornada] = " + iIdPartido;
            }
            else if (iGolLocal != "" && iGolVisitante == "")
            {
                sQuery = "UPDATE [tJornada]" +
                "\r\nSET [iGolesLocal] = " + iGolLocal +
                "\r\nWHERE [idJornada] = " + iIdPartido;
            }
            else if (iGolLocal == "" && iGolVisitante != "")
            {
                sQuery = "UPDATE tJornada" +
                "\r\nSET iGolesVisitante= " + iGolVisitante +
                "\r\nWHERE idJornada = " + iIdPartido;
            }


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

        #region Metodo para Finalizar partido
        public string FinPartido(string iIdPartido, string iGanador, string iGolLocales, string iGolVisitante)
        {
            Conexion cn = new Conexion(CONEXIONDB);
            bool resutl = true;
            string sQuery = "UPDATE tJornada" +
                "\r\nSET [iGanador]= " + iGanador +
                "\r\n,[iGolesLocal] = " + iGolLocales +
                ",\r\n [iGolesVisitante]=" + iGolVisitante +
                "\r\nWHERE idJornada = " + iIdPartido;

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

        #region metodo que genera las tablas de pocisiones
        public string TablaPos(int idLiga)
        {
            string sTabla = "";
            string sIdTabla = "tblPuntos";
            string[] aColumnas = new string[] { "Equipo", "PJ", "PG", "PP", "PE", "GAF", "GEC", "DDF", "PTS", "PP" };
            Conexion cn = new Conexion(CONEXIONDB);
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

    public class DtListJuegos
    {
        public DtListJuegos(string Local, string Visitante, string Jornada, string Liga, string LocGol, string VistGol, string Resultado)
        {
            this.Local = Local;
            this.Visitante = Visitante;
            this.Jornada = Jornada;
            this.Liga = Liga;
            this.LocGol = LocGol;
            this.VistGol = VistGol;
            this.Resultado = Resultado;
        }

        public String Local { get; set; }
        public String Visitante { get; set; }
        public String Jornada { get; set; }
        public String Liga { get; set; }
        public String LocGol { get; set; }
        public String VistGol { get; set; }
        public String Resultado { get; set; }
    }
}