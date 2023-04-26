
using Microsoft.Data.SqlClient;
using System.Data;
using System.Globalization;
using System.Reflection;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ConfigurationManager = System.Configuration.ConfigurationManager;
using System.Security.Policy;

namespace SistemaVenta.AplicacionWeb.SportsAlliance
{
    public class ConexionSQL
    {
        SqlConnection conex = new SqlConnection();



        string cadenaCOnexion = "Data Source=JONATHANMEDINA\\MSSQLSERVERLINUX; Initial Catalog=BD_SportAlliance; Integrated Security=True";

        //public SqlConnection establecerConexion()
        //{
        //    try
        //    {
        //        conex.ConnectionString = cadenaCOnexion;
        //        conex.Open();
        //        Console.WriteLine("Se conecto correctamente a la base de datos");
        //    }
        //    catch(SqlException e)
        //    {
        //        //MessageBox.show();
        //        Console.WriteLine(e.Message);
        //    }

        //    return conex;
        //}

        private SqlConnection oConexion;

        private SqlCommand oComando = null;

        private SqlDataReader oResultados = null;

        private string sConn;

        protected SqlDataReader oResult;

        public ConexionSQL()
        {
            //this.sConn = sConn;
        }

        public void EstablecerConexion()
        {
            //oConexion = new SqlConnection(ConfigurationManager.ConnectionStrings[cadenaCOnexion].ConnectionString);
            conex.ConnectionString = cadenaCOnexion;
            oConexion = conex;
            //try
            //{
            //    oConexion.ConnectionString = cadenaCOnexion;
            //    oConexion.Open();
            //    Console.WriteLine("Se conecto correctamente a la base de datos");
            //}
            //catch (SqlException e)
            //{
            //    //MessageBox.show();
            //    Console.WriteLine(e.Message);
            //}

        }

        public bool EjecutaSQL(string sQuery)
        {
            EstablecerConexion();
            oComando = new SqlCommand(sQuery, oConexion);
            oComando.CommandType = CommandType.Text;
            try
            {
                oConexion.Open();
                oComando.ExecuteReader();
                return true;
            }
            catch (SqlException value)
            {
                Console.Write(value);
                return false;
            }
            finally
            {
                oConexion.Close();
                oConexion.Dispose();
            }
        }

        public List<string> RecuperaRegistros(string sQuery)
        {
            List<string> list = new List<string>();
            EstablecerConexion();
            oComando = new SqlCommand(sQuery, oConexion);
            oComando.CommandType = CommandType.Text;
            oComando.CommandTimeout = 30000;
            try
            {
                oConexion.Open();
                oResultados = oComando.ExecuteReader();
                if (oResultados.HasRows)
                {
                    while (oResultados.Read())
                    {
                        for (int i = 0; i < oResultados.FieldCount; i++)
                        {
                            list.Add(oResultados.GetValue(i).ToString());
                        }
                    }
                }

                return list;
            }
            catch (SqlException value)
            {
                Console.Write(value);
                return null;
            }
            finally
            {
                oConexion.Dispose();
                oConexion.Close();
            }
        }

        public string RecuperaValor(string sQuery)
        {
            EstablecerConexion();
            oComando = new SqlCommand(sQuery, oConexion);
            oComando.CommandType = CommandType.Text;
            string result = "";
            try
            {
                oConexion.Open();
                oResultados = oComando.ExecuteReader();
                if (oResultados.HasRows)
                {
                    while (oResultados.Read())
                    {
                        result = oResultados.GetValue(0).ToString();
                    }
                }

                return result;
            }
            catch (SqlException value)
            {
                Console.Write(value);
                return "-1";
            }
            finally
            {
                oConexion.Dispose();
                oConexion.Close();
            }
        }

        public int RecuperaValornum(string sQuery)
        {
            EstablecerConexion();
            oComando = new SqlCommand(sQuery, oConexion);
            oComando.CommandType = CommandType.Text;
            try
            {
                oConexion.Open();
                object value = oComando.ExecuteScalar();
                return Convert.ToInt32(value);
            }
            catch (SqlException value2)
            {
                Console.Write(value2);
                return 0;
            }
            finally
            {
                oConexion.Dispose();
                oConexion.Close();
            }
        }

        public DataTable GetValues(string sQuery)
        {
            DataTable dataTable = new DataTable();
            EstablecerConexion();
            try
            {
                oComando = new SqlCommand(sQuery, oConexion);
                oComando.CommandType = CommandType.Text;
                oComando.CommandTimeout = 72000;
                oConexion.Open();
                oResult = oComando.ExecuteReader();
                if (oResult.HasRows)
                {
                    dataTable.Load(oResult, LoadOption.OverwriteChanges);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                oConexion.Close();
                oConexion.Dispose();
            }

            return dataTable;
        }

        public void ExecuteQuery(string sQuery)
        {
            EstablecerConexion();
            try
            {
                oComando = new SqlCommand(sQuery, oConexion);
                oComando.CommandType = CommandType.Text;
                oConexion.Open();
                oComando.ExecuteReader();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                oConexion.Close();
                oConexion.Dispose();
            }
        }

        public List<T> GetObjectList<T>(string sQuery) where T : new()
        {
            List<T> list = new List<T>();
            EstablecerConexion();
            try
            {
                oComando = new SqlCommand(sQuery, oConexion);
                oComando.CommandType = CommandType.Text;
                oComando.CommandTimeout = 30000;
                oConexion.Open();
                oResultados = oComando.ExecuteReader();
                while (oResultados.Read())
                {
                    T val = new T();
                    PropertyInfo[] properties = val.GetType().GetProperties();
                    PropertyInfo[] array = properties;
                    foreach (PropertyInfo propertyInfo in array)
                    {
                        propertyInfo.SetValue(val, oResultados.GetValue(oResultados.GetOrdinal(propertyInfo.Name)), null);
                    }

                    list.Add(val);
                }
            }
            catch (Exception ex)
            {
                string text = ex.Message.ToString();
            }
            finally
            {
                oConexion.Close();
                oConexion.Dispose();
            }

            return list;
        }

        public List<T> GetObjectListNull<T>(string sQuery) where T : new()
        {
            List<T> list = new List<T>();
            EstablecerConexion();
            try
            {
                oComando = new SqlCommand(sQuery, oConexion);
                oComando.CommandType = CommandType.Text;
                oComando.CommandTimeout = 30000;
                oConexion.Open();
                oResultados = oComando.ExecuteReader();
                while (oResultados.Read())
                {
                    T val = new T();
                    PropertyInfo[] properties = val.GetType().GetProperties();
                    PropertyInfo[] array = properties;
                    foreach (PropertyInfo propertyInfo in array)
                    {
                        propertyInfo.SetValue(val, oResultados.GetValue(oResultados.GetOrdinal(propertyInfo.Name)).ToString(), null);
                    }

                    list.Add(val);
                }
            }
            catch (Exception)
            {
            }
            finally
            {
                oConexion.Close();
                oConexion.Dispose();
            }

            return list;
        }

        public string EjecutaStoreDataTable(List<string> lstParametros, List<string> lstDatos, string sStore, DataTable dtlDatos)
        {
            string result = "";
            EstablecerConexion();
            try
            {
                oComando = new SqlCommand(sStore, oConexion);
                oComando.CommandType = CommandType.StoredProcedure;
                oComando.Parameters.AddWithValue(lstParametros[0].ToString(), dtlDatos);
                for (int i = 1; i < lstParametros.Count; i++)
                {
                    oComando.Parameters.AddWithValue(lstParametros[i].ToString(), lstDatos[i - 1].ToString());
                }

                oComando.CommandTimeout = 7200000;
                oConexion.Open();
                oResultados = oComando.ExecuteReader();
                if (oResultados.HasRows)
                {
                    while (oResultados.Read())
                    {
                        result = oResultados.GetValue(0).ToString();
                    }
                }

                oConexion.Close();
                return result;
            }
            catch (SqlException value)
            {
                Console.Write(value);
                return "-1";
            }
            finally
            {
                oConexion.Dispose();
                oConexion.Close();
            }
        }

        public List<T> RecuperaObjetoLista<T>(string sQuery, string[] aAtributos) where T : new()
        {
            string text = "1";
            string text2 = "";
            List<T> list = new List<T>();
            try
            {
                EstablecerConexion();
                oConexion.Open();
                oComando = new SqlCommand(sQuery, oConexion);
                oComando.CommandType = CommandType.Text;
                oComando.CommandTimeout = 30000;
                oResultados = oComando.ExecuteReader();
                while (oResultados.Read())
                {
                    T val = new T();
                    PropertyInfo[] properties = val.GetType().GetProperties();
                    PropertyInfo[] array = properties;
                    foreach (PropertyInfo propertyInfo in array)
                    {
                        if (Array.IndexOf(aAtributos, propertyInfo.Name) >= 0 && !oResultados.IsDBNull(Array.IndexOf(aAtributos, propertyInfo.Name)))
                        {
                            text2 = oResultados.GetValue(Array.IndexOf(aAtributos, propertyInfo.Name)).ToString();
                            if (propertyInfo.PropertyType == typeof(decimal))
                            {
                                text2 = oResultados.GetValue(Array.IndexOf(aAtributos, propertyInfo.Name)).ToString();
                                text2 = decimal.Parse(text2, NumberStyles.Float | NumberStyles.AllowThousands).ToString();
                            }

                            propertyInfo.SetValue(val, Convert.ChangeType(text2, propertyInfo.PropertyType, null), null);
                        }
                    }

                    list.Add(val);
                }
            }
            catch (Exception ex)
            {
                text = ex.Message.ToString();
            }
            finally
            {
                oConexion.Close();
                oConexion.Dispose();
            }

            return list;
        }

        public string EjecutaStoreDataSet(List<string> lstParametros, List<string> lstDatos, string sStore, DataSet dtsDatos)
        {
            string result = "";
            EstablecerConexion();
            try
            {
                oComando = new SqlCommand(sStore, oConexion);
                oComando.CommandType = CommandType.StoredProcedure;
                int num = 0;
                for (int i = 0; i < dtsDatos.Tables.Count; i++)
                {
                    oComando.Parameters.AddWithValue(lstParametros[i].ToString(), dtsDatos.Tables[i]);
                    num = i;
                }

                num++;
                for (int i = 0; i < lstParametros.Count - num; i++)
                {
                    oComando.Parameters.AddWithValue(lstParametros[i + num].ToString(), lstDatos[i].ToString());
                }

                oComando.CommandTimeout = 7200000;
                oConexion.Open();
                oResultados = oComando.ExecuteReader();
                if (oResultados.HasRows)
                {
                    while (oResultados.Read())
                    {
                        result = oResultados.GetValue(0).ToString();
                    }
                }

                oConexion.Close();
                return result;
            }
            catch (SqlException value)
            {
                Console.Write(value);
                return "-1";
            }
            finally
            {
                oConexion.Dispose();
                oConexion.Close();
            }
        }

        public DataSet GetValuesDataSet(string query)
        {
            DataSet dataSet = new DataSet();
            EstablecerConexion();
            try
            {
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(query, oConexion);
                sqlDataAdapter.SelectCommand.CommandTimeout = 0;
                sqlDataAdapter.Fill(dataSet);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return dataSet;
        }
    }
}
