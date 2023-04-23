using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVentas.BLL.Interfaces
{
    public interface ICorreosServices
    {
        Task<bool> EnviarCorreos(string CorreoDestino, string Asunto, string Mensaje);
    }
}
