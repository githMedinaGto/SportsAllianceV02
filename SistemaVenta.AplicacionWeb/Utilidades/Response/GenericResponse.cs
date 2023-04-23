namespace SistemaVenta.AplicacionWeb.Utilidades.Response
{
    public class GenericResponse<TObject>
    {
        public bool Estado { get; set; }

        public string? Mensaje { get; set; }

        public TObject? Object { get; set; }

        public List<TObject?>? ListaObject { get; set; }

    }
}
