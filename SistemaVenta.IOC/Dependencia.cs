using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SistemVentas.DAL.DBventaContext;
using Microsoft.EntityFrameworkCore;
using SistemaVentas.DAL.Interfaces;
using SistemaVentas.DAL.Implementacion;
using SistemaVentas.BLL.Interfaces;
using SistemaVentas.BLL.Implementacion;
using SistemaVenta.BLL.Implementacion;
using SistemaVenta.BLL.Interfaces;

namespace SistemaVenta.IOC
{
    public static class Dependencia
    {
        public static void InyectarDependencia(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DbventaContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("CadenaSQL"));
            });

            services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IVentaRepository, VentaRepository>();

            services.AddScoped<ICorreosServices, CorreoService>();
            services.AddScoped<IFireBaseService, FireBaseService>();

            services.AddScoped<IUtilidadesService, UtilidadesService>();
            services.AddScoped<IRolService, RolService>();

            services.AddScoped<IUsuarioService, UsuarioService>();

            services.AddScoped<INegocioService, NegocioService>();

            //services.AddScoped<ICategoriasService, CategoriasService>();
            services.AddScoped<ICategoriasService, CategoriasService>();
            services.AddScoped<IProductoService, ProductoService>();

            services.AddScoped<ITipoDocumentoVentaService, TipoDocumentoVentaService>();
            services.AddScoped<IVentaService, VentaService>();
            services.AddScoped<IDashBoardService, DashBoardService>();
            services.AddScoped<IMenuService, MenuService>();
        }
    }
}
