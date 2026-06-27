using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using FuerzaCivil.Api.Data;
using FuerzaCivil.Api.DTOs;
using FuerzaCivil.Api.Models;

namespace FuerzaCivil.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PuntosInteresController : ControllerBase
{
    private readonly AppDbContext _db;
    public PuntosInteresController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<PuntoInteresDto>>> GetAll(
        [FromQuery] string? tipo, [FromQuery] string? search)
    {
        var query = _db.PuntosInteres.AsQueryable();
        if (!string.IsNullOrWhiteSpace(tipo))
            query = query.Where(p => p.Tipo == Enum.Parse<TipoPuntoInteres>(tipo));
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Nombre.Contains(search) || (p.Responsable != null && p.Responsable.Contains(search)));

        var items = await query.OrderBy(p => p.Nombre).ToListAsync();
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PuntoInteresDto>> GetById(Guid id)
    {
        var item = await _db.PuntosInteres.FindAsync(id);
        return item is null ? NotFound() : Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PuntoInteresDto>> Create(CreatePuntoInteresDto dto)
    {
        var point = new Point(dto.Longitud, dto.Latitud) { SRID = 4326 };
        var entity = new PuntoInteres
        {
            Tipo = Enum.Parse<TipoPuntoInteres>(dto.Tipo),
            Nombre = dto.Nombre,
            Ubicacion = point,
            Direccion = dto.Direccion,
            Ciudad = dto.Ciudad,
            Municipio = dto.Municipio,
            Estado = dto.Estado,
            Responsable = dto.Responsable,
            Telefono = dto.Telefono,
            Capacidad = dto.Capacidad,
            DonacionesRecibidas = dto.DonacionesRecibidas,
            Beneficiarios = dto.Beneficiarios,
            EstadoOperativo = dto.EstadoOperativo ?? "activo",
            TiposDonacion = dto.TiposDonacion ?? [],
        };
        _db.PuntosInteres.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<PuntoInteresDto>> Update(Guid id, UpdatePuntoInteresDto dto)
    {
        var entity = await _db.PuntosInteres.FindAsync(id);
        if (entity is null) return NotFound();

        if (dto.Tipo is not null) entity.Tipo = Enum.Parse<TipoPuntoInteres>(dto.Tipo);
        if (dto.Nombre is not null) entity.Nombre = dto.Nombre;
        if (dto.Latitud.HasValue || dto.Longitud.HasValue)
        {
            var lat = dto.Latitud ?? entity.Ubicacion.Y;
            var lng = dto.Longitud ?? entity.Ubicacion.X;
            entity.Ubicacion = new Point(lng, lat) { SRID = 4326 };
        }
        if (dto.Direccion is not null) entity.Direccion = dto.Direccion;
        if (dto.Ciudad is not null) entity.Ciudad = dto.Ciudad;
        if (dto.Municipio is not null) entity.Municipio = dto.Municipio;
        if (dto.Estado is not null) entity.Estado = dto.Estado;
        if (dto.Responsable is not null) entity.Responsable = dto.Responsable;
        if (dto.Telefono is not null) entity.Telefono = dto.Telefono;
        if (dto.Capacidad.HasValue) entity.Capacidad = dto.Capacidad.Value;
        if (dto.DonacionesRecibidas.HasValue) entity.DonacionesRecibidas = dto.DonacionesRecibidas.Value;
        if (dto.Beneficiarios.HasValue) entity.Beneficiarios = dto.Beneficiarios.Value;
        if (dto.EstadoOperativo is not null) entity.EstadoOperativo = dto.EstadoOperativo;
        if (dto.TiposDonacion is not null) entity.TiposDonacion = dto.TiposDonacion;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UltimaActualizacion = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(entity));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await _db.PuntosInteres.FindAsync(id);
        if (entity is null) return NotFound();
        _db.PuntosInteres.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static PuntoInteresDto MapToDto(PuntoInteres p) => new(
        p.Id, p.Tipo.ToString(), p.Nombre,
        p.Ubicacion.Y, p.Ubicacion.X,
        p.Direccion, p.Ciudad, p.Municipio, p.Estado,
        p.Responsable, p.Telefono,
        p.Capacidad, p.DonacionesRecibidas, p.Beneficiarios,
        p.EstadoOperativo, p.TiposDonacion, p.UltimaActualizacion
    );
}
