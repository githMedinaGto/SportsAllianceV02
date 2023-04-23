namespace SistemaVenta.AplicacionWeb.Models.ViewModels
{
    public class VMDashBoard
    {
        public int TotalVentas { get; set; }

        public string? TotalIngresos { get; set;}
        public string? TotaIngresos { get; set;}
        public int? ToatalCategorias { get; set; }
        public int? TotalProductos { get; set; }

        public List<VMventasSemana> VentasUltimaSemana { get; set; }
        public List<VMProductosSemana> ProductosTopUltimaSemana { get; set; }
    }
}
