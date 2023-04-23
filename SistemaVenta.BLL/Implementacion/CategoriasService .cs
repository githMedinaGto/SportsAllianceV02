﻿using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Interfaces;
using SistemaVentas.DAL.Interfaces;
using SistemVentas.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.BLL.Implementacion
{
    public class CategoriasService : ICategoriasService
    {

        private readonly IGenericRepository<Categoria> _repositorio;

        public CategoriasService(IGenericRepository<Categoria> repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<Categoria>> Lista()
        {
            IQueryable<Categoria> query = await _repositorio.Consultar();
            return query.ToList();
        }
        public async Task<Categoria> Crear(Categoria entidad)
        {
            try
            {
                Categoria categori_creada = await _repositorio.Crear(entidad);
                if (categori_creada.IdCategoria == 0)
                    throw new TaskCanceledException("No se pudo crear la categoria");

                return categori_creada;
            }
            catch
            {
                throw;
            }
        }

        public async Task<Categoria> Editar(Categoria entidad)
        {
            try
            {
                Categoria categoria_encontrada = await _repositorio.Obtener(c => c.IdCategoria == entidad.IdCategoria);

                categoria_encontrada.Descripcion = entidad.Descripcion;
                categoria_encontrada.EsActivo = entidad.EsActivo;

                bool respuesta = await _repositorio.Editar(categoria_encontrada);

                if (!respuesta)
                    throw new TaskCanceledException("No se pudo modificar la categoria");

                return categoria_encontrada;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int idCategoria)
        {
            try
            {
                Categoria categoria_encontrada = await _repositorio.Obtener(c => c.IdCategoria == idCategoria);
                if (categoria_encontrada == null)
                    throw new TaskCanceledException("La categoria no existe");

                bool respueta = await _repositorio.Eliminar(categoria_encontrada);

                return respueta;
            }
            catch
            {
                throw;
            }
        }


    }
}