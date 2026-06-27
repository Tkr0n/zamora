using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FuerzaCivil.Api.Data;
using FuerzaCivil.Api.DTOs;
using FuerzaCivil.Api.Models;

namespace FuerzaCivil.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InsumosController : ControllerBase
{
    private readonly AppDbContext _db;
    public InsumosController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<InsumoDto>>> GetAll([FromQuery] Guid? puntoInteresId)
    {
        var query = _db.Insumos.AsQueryable();
        if (puntoInteresId.HasValue)
            query = query.Where(i => i.PuntoInteresId == puntoInteresId.Value);
        var items = await query.OrderBy(i => i.Nombre).ToListAsync();
        return Ok(items.Select(MapToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InsumoDto>> GetById(Guid id)
    {
        var item = await _db.Insumos.FindAsync(id);
        return item is null ? NotFound() : Ok(MapToDto(item));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<InsumoDto>> Create(CreateInsumoDto dto)
    {
        var punto = await _db.PuntosInteres.FindAsync(dto.PuntoInteresId);
        if (punto is null) return BadRequest("PuntoInteresId invalido");

        var entity = new Insumo
        {
            PuntoInteresId = dto.PuntoInteresId,
            Nombre = dto.Nombre,
            Categoria = dto.Categoria,
            Prioridad = dto.Prioridad,
            CantidadNecesaria = dto.CantidadNecesaria,
            CantidadDisponible = dto.CantidadDisponible,
            Unidad = dto.Unidad,
        };
        _db.Insumos.Add(entity);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, MapToDto(entity));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<InsumoDto>> Update(Guid id, UpdateInsumoDto dto)
    {
        var entity = await _db.Insumos.FindAsync(id);
        if (entity is null) return NotFound();

        if (dto.Nombre is not null) entity.Nombre = dto.Nombre;
        if (dto.Categoria is not null) entity.Categoria = dto.Categoria;
        if (dto.Prioridad is not null) entity.Prioridad = dto.Prioridad;
        if (dto.CantidadNecesaria.HasValue) entity.CantidadNecesaria = dto.CantidadNecesaria.Value;
        if (dto.CantidadDisponible.HasValue) entity.CantidadDisponible = dto.CantidadDisponible.Value;
        if (dto.Unidad is not null) entity.Unidad = dto.Unidad;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(entity));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await _db.Insumos.FindAsync(id);
        if (entity is null) return NotFound();
        _db.Insumos.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static InsumoDto MapToDto(Insumo i) => new(
        i.Id, i.PuntoInteresId, i.Nombre, i.Categoria,
        i.Prioridad, i.CantidadNecesaria, i.CantidadDisponible, i.Unidad
    );
}
