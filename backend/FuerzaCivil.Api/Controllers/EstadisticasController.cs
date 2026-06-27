using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FuerzaCivil.Api.Data;
using FuerzaCivil.Api.DTOs;

namespace FuerzaCivil.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstadisticasController : ControllerBase
{
    private readonly AppDbContext _db;
    public EstadisticasController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<EstadisticasDto>> Get()
    {
        var puntos = await _db.PuntosInteres.ToListAsync();
        var zonas = await _db.ZonasAfectadas.ToListAsync();

        var activos = puntos.Count(p => p.EstadoOperativo == "activo");
        var parciales = puntos.Count(p => p.EstadoOperativo == "parcial");
        var inactivos = puntos.Count(p => p.EstadoOperativo == "inactivo");
        var totalDonaciones = puntos.Sum(p => p.DonacionesRecibidas);
        var totalBeneficiarios = puntos.Sum(p => p.Beneficiarios);
        var totalCapacidad = puntos.Sum(p => p.Capacidad);
        var tasa = totalCapacidad > 0 ? Math.Round((double)totalDonaciones / totalCapacidad * 100, 1) : 0;

        return Ok(new EstadisticasDto(
            puntos.Count, activos, parciales, inactivos,
            totalDonaciones, totalBeneficiarios, totalCapacidad, tasa,
            zonas.Count,
            zonas.Count > 0 ? Math.Round(zonas.Average(z => z.Intensidad), 2) : 0
        ));
    }
}
