using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NetTopologySuite.Geometries;
using FuerzaCivil.Api.Data;
using FuerzaCivil.Api.DTOs;
using FuerzaCivil.Api.Models;

namespace FuerzaCivil.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportesController(AppDbContext db) => _db = db;

    [HttpPost]
    [EnableRateLimiting("reportes")]
    public async Task<ActionResult<ZonaAfectadaDto>> Reportar(ReporteCiudadanoDto dto)
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
        return CreatedAtAction(null, new ZonaAfectadaDto(
            entity.Id, entity.Ubicacion.Y, entity.Ubicacion.X,
            entity.Intensidad, entity.RadioKm, entity.Descripcion,
            entity.ReportadoPor, entity.FechaReporte
        ));
    }
}
