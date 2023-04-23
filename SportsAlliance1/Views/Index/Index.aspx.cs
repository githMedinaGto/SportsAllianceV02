using SportsAlliance1.Models.Index;
using SportsAlliance1.Models.Liga;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SportsAlliance1.Views.Index
{
    public partial class Index : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        #region Metodo de llenado del como de liga
        [WebMethod]
        public static string LlenarComboLiga()
        {
            string sRespuesta = "";
            DataTable dDatos = new DataTable();
            IndexModels lm = new IndexModels();
            dDatos = lm.LlenarComboLiga();

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

        #region Metodo de llenado del como de equipos
        [WebMethod]
        public static string TablaJornada(int idLiga)
        {
            IndexModels lm = new IndexModels();
            return lm.TablaJornada(idLiga);
        }
        #endregion

        #region Metodo de llenado del como de equipos
        [WebMethod]
        public static string TablaPos(int idLiga)
        {
            LigaModels lm = new LigaModels();
            return lm.TablaPos(idLiga);
        }
        #endregion
    }
}