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
public class ZonasAfectadasController : ControllerBase
{
    private readonly AppDbContext _db;
    public ZonasAfectadasController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ZonaAfectadaDto>>> GetAll()
    {
        var items = await _db.ZonasAfectadas.OrderByDescending(z => z.FechaReporte).ToListAsync();
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ZonaAfectadaDto>> GetById(Guid id)
    {
        var item = await _db.ZonasAfectadas.FindAsync(id);
        return item is null ? NotFound() : Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ZonaAfectadaDto>> Create(CreateZonaAfectadaDto dto)
    {
        var entity = new ZonaAfectada
        {
            Ubicacion = new Point(dto.Longitud, dto.Latitud) { SRID = 4326 },
            Intensidad = dto.Intensidad,
            RadioKm = dto.RadioKm,
            Descripcion = dto.Descripcion,
            ReportadoPor = dto.ReportadoPor,
        };
        _db.ZonasAfectadas.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ZonaAfectadaDto>> Update(Guid id, CreateZonaAfectadaDto dto)
    {
        var entity = await _db.ZonasAfectadas.FindAsync(id);
        if (entity is null) return NotFound();

        entity.Ubicacion = new Point(dto.Longitud, dto.Latitud) { SRID = 4326 };
        entity.Intensidad = dto.Intensidad;
        entity.RadioKm = dto.RadioKm;
        entity.Descripcion = dto.Descripcion;
        entity.ReportadoPor = dto.ReportadoPor;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(entity));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await _db.ZonasAfectadas.FindAsync(id);
        if (entity is null) return NotFound();
        _db.ZonasAfectadas.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static ZonaAfectadaDto MapToDto(ZonaAfectada z) => new(
        z.Id, z.Ubicacion.Y, z.Ubicacion.X,
        z.Intensidad, z.RadioKm, z.Descripcion,
        z.ReportadoPor, z.FechaReporte
    );
}
