using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace SistemaVentas.DAL.Interfaces
{
    public interface IGenericRepository<TEentity> where TEentity : class
    {
        Task<TEentity> Obtener(Expression<Func<TEentity, bool>> filtro);
        Task<TEentity> Crear(TEentity entidad);
        Task<bool> Editar(TEentity entidad);
        Task<bool> Eliminar(TEentity entidad);
        Task<IQueryable<TEentity>> Consultar(Expression<Func<TEentity,bool>> filtro = null);
    }
}
