using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FuerzaCivil.Api.Data;
using FuerzaCivil.Api.DTOs;

namespace FuerzaCivil.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigController : ControllerBase
{
    private readonly AppDbContext _db;
    public ConfigController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ConfigDto>> Get()
    {
        var config = await _db.ConfigApp.FirstOrDefaultAsync();
        if (config is null) return NotFound();
        return Ok(new ConfigDto(config.Id, config.LatitudDefault, config.LongitudDefault,
            config.ZoomDefault, config.Municipio, config.Estado, config.Pais));
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<ConfigDto>> Update(UpdateConfigDto dto)
    {
        var config = await _db.ConfigApp.FirstOrDefaultAsync();
        if (config is null)
        {
            config = new Models.ConfigApp();
            _db.ConfigApp.Add(config);
        }

        if (dto.LatitudDefault.HasValue) config.LatitudDefault = dto.LatitudDefault.Value;
        if (dto.LongitudDefault.HasValue) config.LongitudDefault = dto.LongitudDefault.Value;
        if (dto.ZoomDefault.HasValue) config.ZoomDefault = dto.ZoomDefault.Value;
        if (dto.Municipio is not null) config.Municipio = dto.Municipio;
        if (dto.Estado is not null) config.Estado = dto.Estado;
        if (dto.Pais is not null) config.Pais = dto.Pais;
        config.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new ConfigDto(config.Id, config.LatitudDefault, config.LongitudDefault,
            config.ZoomDefault, config.Municipio, config.Estado, config.Pais));
    }
}
