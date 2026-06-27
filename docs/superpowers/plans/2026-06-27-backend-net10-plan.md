# Backend .NET 10 + Monorepo Restructure - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize into monorepo (frontend/backend/docs), create .NET 10 Web API with PostgreSQL+PostGIS, EF Core, Auth0 JWT auth, and full CRUD for all entities.

**Architecture:** Move current Next.js code to `frontend/`, scaffold .NET 10 Web API in `backend/` with Models → DbContext → Controllers pattern, use Auth0 for JWT validation, PostGIS for geo queries.

**Tech Stack:** .NET 10, EF Core 10, Npgsql, NetTopologySuite, PostgreSQL 17 + PostGIS, Auth0 JWT Bearer

---

### Task 1: Restructure directories — move frontend, create backend + docs

**Files:**
- Move: all current project files → `frontend/`
- Create: `backend/`, `docs/` (already exists)

- [ ] **Step 1: Create the frontend directory and move all current files**

```powershell
New-Item -ItemType Directory -Path "F:\Verkku\FuerzaCivil\frontend" -Force
```

Then move everything except `frontend/`, `backend/`, `docs/`, `.git/`, and `node_modules/` into `frontend/`:

```powershell
$exclude = @('frontend', 'backend', 'docs', '.git', 'node_modules')
Get-ChildItem -Path "F:\Verkku\FuerzaCivil" -Name | Where-Object { $exclude -notcontains $_ } | ForEach-Object {
    Move-Item -Path "F:\Verkku\FuerzaCivil\$_" -Destination "F:\Verkku\FuerzaCivil\frontend\$_" -Force
}
```

- [ ] **Step 2: Verify frontend still works from new location**

```powershell
cd F:\Verkku\FuerzaCivil\frontend
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Create backend directory**

```powershell
New-Item -ItemType Directory -Path "F:\Verkku\FuerzaCivil\backend" -Force
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: restructure into monorepo (frontend/ + backend/ + docs/)"
```

---

### Task 2: Scaffold .NET 10 Web API project

**Files:**
- Create: `backend/FuerzaCivil.Api.csproj`
- Create: `backend/Program.cs`

- [ ] **Step 1: Create the Web API project**

```powershell
cd F:\Verkku\FuerzaCivil\backend
dotnet new webapi -n FuerzaCivil.Api --use-controllers --no-https
```

- [ ] **Step 2: Remove template boilerplate**

Delete `backend/FuerzaCivil.Api/WeatherForecast.cs` and `backend/FuerzaCivil.Api/Controllers/WeatherForecastController.cs`:

```powershell
Remove-Item -Force "F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api\WeatherForecast.cs" -ErrorAction SilentlyContinue
Remove-Item -Force "F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api\Controllers\WeatherForecastController.cs" -ErrorAction SilentlyContinue
```

- [ ] **Step 3: Verify project builds**

```powershell
cd F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: scaffold .NET 10 Web API project"
```

---

### Task 3: Install NuGet packages

**Files:**
- Modify: `backend/FuerzaCivil.Api/FuerzaCivil.Api.csproj`

- [ ] **Step 1: Install required packages**

```powershell
cd F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

- [ ] **Step 2: Verify build still passes**

```powershell
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 3: Commit**

```bash
git add backend/
git commit -m "chore: add EF Core, Npgsql, PostGIS, Auth0 JWT packages"
```

---

### Task 4: Create entity models

**Files:**
- Create: `backend/FuerzaCivil.Api/Models/PuntoInteres.cs`
- Create: `backend/FuerzaCivil.Api/Models/ZonaAfectada.cs`
- Create: `backend/FuerzaCivil.Api/Models/Insumo.cs`
- Create: `backend/FuerzaCivil.Api/Models/ConfigApp.cs`

- [ ] **Step 1: Create directories**

```powershell
New-Item -ItemType Directory -Path "F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api\Models" -Force
```

- [ ] **Step 2: Write PuntoInteres.cs**

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace FuerzaCivil.Api.Models;

public enum TipoPuntoInteres
{
    centro_acopio,
    centro_medico,
    institucion,
    albergue,
    zona_segura,
    punto_agua,
    punto_distribucion
}

public class PuntoInteres
{
    [Key]
    public Guid Id { get; set; } = Guid.CreateVersion7();

    [Column(TypeName = "varchar(30)")]
    public TipoPuntoInteres Tipo { get; set; }

    [Required, MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    [Column(TypeName = "geography(Point, 4326)")]
    public Point Ubicacion { get; set; } = null!;

    [MaxLength(300)]
    public string? Direccion { get; set; }

    [MaxLength(100)]
    public string? Ciudad { get; set; }

    [MaxLength(100)]
    public string? Municipio { get; set; }

    [MaxLength(100)]
    public string? Estado { get; set; }

    [MaxLength(200)]
    public string? Responsable { get; set; }

    [MaxLength(20)]
    public string? Telefono { get; set; }

    public int Capacidad { get; set; }
    public int DonacionesRecibidas { get; set; }
    public int Beneficiarios { get; set; }

    [MaxLength(20)]
    public string EstadoOperativo { get; set; } = "activo";

    [Column(TypeName = "text[]")]
    public string[] TiposDonacion { get; set; } = [];

    public DateTime UltimaActualizacion { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Insumo> Insumos { get; set; } = [];
}
```

- [ ] **Step 3: Write ZonaAfectada.cs**

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace FuerzaCivil.Api.Models;

public class ZonaAfectada
{
    [Key]
    public Guid Id { get; set; } = Guid.CreateVersion7();

    [Column(TypeName = "geography(Point, 4326)")]
    public Point Ubicacion { get; set; } = null!;

    [Range(0, 1)]
    public double Intensidad { get; set; }

    public double RadioKm { get; set; } = 0.5;

    [MaxLength(500)]
    public string? Descripcion { get; set; }

    [MaxLength(200)]
    public string? ReportadoPor { get; set; }

    public DateTime FechaReporte { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

- [ ] **Step 4: Write Insumo.cs**

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FuerzaCivil.Api.Models;

public class Insumo
{
    [Key]
    public Guid Id { get; set; } = Guid.CreateVersion7();

    public Guid PuntoInteresId { get; set; }

    [ForeignKey(nameof(PuntoInteresId))]
    public PuntoInteres? PuntoInteres { get; set; }

    [Required, MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    [Required, MaxLength(30)]
    public string Categoria { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Prioridad { get; set; } = string.Empty;

    public int CantidadNecesaria { get; set; }
    public int CantidadDisponible { get; set; }

    [MaxLength(50)]
    public string? Unidad { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

- [ ] **Step 5: Write ConfigApp.cs**

```csharp
using System.ComponentModel.DataAnnotations;

namespace FuerzaCivil.Api.Models;

public class ConfigApp
{
    [Key]
    public int Id { get; set; } = 1;

    public double LatitudDefault { get; set; } = 10.4709;
    public double LongitudDefault { get; set; } = -66.5485;
    public int ZoomDefault { get; set; } = 13;

    [MaxLength(100)]
    public string Municipio { get; set; } = "Zamora";

    [MaxLength(100)]
    public string Estado { get; set; } = "Miranda";

    [MaxLength(100)]
    public string Pais { get; set; } = "Venezuela";

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

- [ ] **Step 6: Verify build**

```powershell
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 7: Commit**

```bash
git add backend/FuerzaCivil.Api/Models/
git commit -m "feat: add entity models (PuntoInteres, ZonaAfectada, Insumo, ConfigApp)"
```

---

### Task 5: Create DTOs

**Files:**
- Create: `backend/FuerzaCivil.Api/DTOs/PuntoInteresDto.cs`
- Create: `backend/FuerzaCivil.Api/DTOs/ZonaAfectadaDto.cs`
- Create: `backend/FuerzaCivil.Api/DTOs/InsumoDto.cs`
- Create: `backend/FuerzaCivil.Api/DTOs/ConfigDto.cs`
- Create: `backend/FuerzaCivil.Api/DTOs/EstadisticasDto.cs`

- [ ] **Step 1: Create DTOs directory**

```powershell
New-Item -ItemType Directory -Path "F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api\DTOs" -Force
```

- [ ] **Step 2: Write PuntoInteresDto.cs**

```csharp
namespace FuerzaCivil.Api.DTOs;

public record PuntoInteresDto(
    Guid Id,
    string Tipo,
    string Nombre,
    double Latitud,
    double Longitud,
    string? Direccion,
    string? Ciudad,
    string? Municipio,
    string? Estado,
    string? Responsable,
    string? Telefono,
    int Capacidad,
    int DonacionesRecibidas,
    int Beneficiarios,
    string EstadoOperativo,
    string[] TiposDonacion,
    DateTime UltimaActualizacion
);

public record CreatePuntoInteresDto(
    string Tipo,
    string Nombre,
    double Latitud,
    double Longitud,
    string? Direccion,
    string? Ciudad,
    string? Municipio,
    string? Estado,
    string? Responsable,
    string? Telefono,
    int Capacidad,
    int DonacionesRecibidas,
    int Beneficiarios,
    string? EstadoOperativo,
    string[]? TiposDonacion
);

public record UpdatePuntoInteresDto(
    string? Tipo,
    string? Nombre,
    double? Latitud,
    double? Longitud,
    string? Direccion,
    string? Ciudad,
    string? Municipio,
    string? Estado,
    string? Responsable,
    string? Telefono,
    int? Capacidad,
    int? DonacionesRecibidas,
    int? Beneficiarios,
    string? EstadoOperativo,
    string[]? TiposDonacion
);
```

- [ ] **Step 3: Write ZonaAfectadaDto.cs**

```csharp
namespace FuerzaCivil.Api.DTOs;

public record ZonaAfectadaDto(
    Guid Id,
    double Latitud,
    double Longitud,
    double Intensidad,
    double RadioKm,
    string? Descripcion,
    string? ReportadoPor,
    DateTime FechaReporte
);

public record CreateZonaAfectadaDto(
    double Latitud,
    double Longitud,
    double Intensidad,
    double RadioKm,
    string? Descripcion,
    string? ReportadoPor
);

public record ReporteCiudadanoDto(
    double Latitud,
    double Longitud,
    double Intensidad,
    double RadioKm,
    string Descripcion,
    string ReportadoPor
);
```

- [ ] **Step 4: Write InsumoDto.cs**

```csharp
namespace FuerzaCivil.Api.DTOs;

public record InsumoDto(
    Guid Id,
    Guid PuntoInteresId,
    string Nombre,
    string Categoria,
    string Prioridad,
    int CantidadNecesaria,
    int CantidadDisponible,
    string? Unidad
);

public record CreateInsumoDto(
    Guid PuntoInteresId,
    string Nombre,
    string Categoria,
    string Prioridad,
    int CantidadNecesaria,
    int CantidadDisponible,
    string? Unidad
);

public record UpdateInsumoDto(
    string? Nombre,
    string? Categoria,
    string? Prioridad,
    int? CantidadNecesaria,
    int? CantidadDisponible,
    string? Unidad
);
```

- [ ] **Step 5: Write ConfigDto.cs**

```csharp
namespace FuerzaCivil.Api.DTOs;

public record ConfigDto(
    int Id,
    double LatitudDefault,
    double LongitudDefault,
    int ZoomDefault,
    string Municipio,
    string Estado,
    string Pais
);

public record UpdateConfigDto(
    double? LatitudDefault,
    double? LongitudDefault,
    int? ZoomDefault,
    string? Municipio,
    string? Estado,
    string? Pais
);
```

- [ ] **Step 6: Write EstadisticasDto.cs**

```csharp
namespace FuerzaCivil.Api.DTOs;

public record EstadisticasDto(
    int TotalPuntos,
    int Activos,
    int Parciales,
    int Inactivos,
    int TotalDonaciones,
    int TotalBeneficiarios,
    int TotalCapacidad,
    double TasaUtilizacion,
    int TotalZonasAfectadas,
    double IntensidadPromedio
);
```

- [ ] **Step 7: Verify build**

```powershell
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 8: Commit**

```bash
git add backend/FuerzaCivil.Api/DTOs/
git commit -m "feat: add DTOs for all entities"
```

---

### Task 6: Create DbContext with PostGIS

**Files:**
- Create: `backend/FuerzaCivil.Api/Data/AppDbContext.cs`

- [ ] **Step 1: Create Data directory**

```powershell
New-Item -ItemType Directory -Path "F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api\Data" -Force
```

- [ ] **Step 2: Write AppDbContext.cs**

```csharp
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using FuerzaCivil.Api.Models;

namespace FuerzaCivil.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<PuntoInteres> PuntosInteres => Set<PuntoInteres>();
    public DbSet<Insumo> Insumos => Set<Insumo>();
    public DbSet<ZonaAfectada> ZonasAfectadas => Set<ZonaAfectada>();
    public DbSet<ConfigApp> ConfigApp => Set<ConfigApp>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PuntoInteres>(entity =>
        {
            entity.ToTable("puntos_interes");
            entity.HasIndex(e => e.Ubicacion).HasMethod("GIST");
            entity.HasIndex(e => e.Tipo);
            entity.Property(e => e.Tipo).HasConversion<string>();
            entity.HasMany(e => e.Insumos)
                  .WithOne(i => i.PuntoInteres)
                  .HasForeignKey(i => i.PuntoInteresId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Insumo>(entity =>
        {
            entity.ToTable("insumos");
        });

        modelBuilder.Entity<ZonaAfectada>(entity =>
        {
            entity.ToTable("zonas_afectadas");
            entity.HasIndex(e => e.Ubicacion).HasMethod("GIST");
        });

        modelBuilder.Entity<ConfigApp>(entity =>
        {
            entity.ToTable("config_app");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        // Extensión PostGIS
        modelBuilder.HasPostgresExtension("postgis");
    }
}
```

- [ ] **Step 3: Verify build**

```powershell
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 4: Commit**

```bash
git add backend/FuerzaCivil.Api/Data/
git commit -m "feat: add AppDbContext with PostGIS support"
```

---

### Task 7: Configure Program.cs — Auth0 JWT, CORS, EF Core, Swagger

**Files:**
- Modify: `backend/FuerzaCivil.Api/Program.cs`

- [ ] **Step 1: Read current Program.cs**

Read the scaffolded Program.cs to understand what needs to change.

- [ ] **Step 2: Write the full Program.cs**

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using FuerzaCivil.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// ── EF Core + PostgreSQL + PostGIS ──
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.UseNetTopologySuite()
    ));

// ── Auth0 JWT ──
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Auth0:Authority"];
        options.Audience = builder.Configuration["Auth0:Audience"];
    });

builder.Services.AddAuthorization();

// ── CORS ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["Cors:Origin"] ?? "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ── Controllers + Swagger ──
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

- [ ] **Step 3: Delete template's Program.cs content and replace with above**

Use Write tool to replace `backend/FuerzaCivil.Api/Program.cs` entirely.

- [ ] **Step 4: Add appsettings.Development.json with connection string**

Create `backend/FuerzaCivil.Api/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=fuerzacivil;Username=postgres;Password=postgres"
  },
  "Auth0": {
    "Authority": "https://YOUR_DOMAIN.auth0.com/",
    "Audience": "https://api.fuerzacivil.com"
  },
  "Cors": {
    "Origin": "http://localhost:3000"
  }
}
```

- [ ] **Step 5: Verify build**

```powershell
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 6: Commit**

```bash
git add backend/FuerzaCivil.Api/Program.cs backend/FuerzaCivil.Api/appsettings.Development.json
git commit -m "feat: configure Program.cs with Auth0 JWT, EF Core, CORS, Swagger"
```

---

### Task 8: Create Controllers

**Files:**
- Create: `backend/FuerzaCivil.Api/Controllers/PuntosInteresController.cs`
- Create: `backend/FuerzaCivil.Api/Controllers/ZonasAfectadasController.cs`
- Create: `backend/FuerzaCivil.Api/Controllers/InsumosController.cs`
- Create: `backend/FuerzaCivil.Api/Controllers/ConfigController.cs`
- Create: `backend/FuerzaCivil.Api/Controllers/EstadisticasController.cs`
- Create: `backend/FuerzaCivil.Api/Controllers/ReportesController.cs`

- [ ] **Step 1: Write PuntosInteresController.cs**

```csharp
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
```

- [ ] **Step 2: Write ZonasAfectadasController.cs**

```csharp
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
```

- [ ] **Step 3: Write InsumosController.cs**

```csharp
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
        if (punto is null) return BadRequest("PuntoInteresId inválido");

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
```

- [ ] **Step 4: Write ConfigController.cs**

```csharp
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
```

- [ ] **Step 5: Write EstadisticasController.cs**

```csharp
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
```

- [ ] **Step 6: Write ReportesController.cs** (ciudadano, público)

```csharp
using Microsoft.AspNetCore.Mvc;
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
```

- [ ] **Step 7: Verify build**

```powershell
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 8: Commit**

```bash
git add backend/FuerzaCivil.Api/Controllers/
git commit -m "feat: add all API controllers (CRUD + estadisticas + reportes)"
```

---

### Task 9: Create initial migration and seed data

**Files:**
- Create: `backend/FuerzaCivil.Api/Data/SeedData.cs`

- [ ] **Step 1: Install EF Core tools**

```powershell
dotnet tool install --global dotnet-ef
```

- [ ] **Step 2: Create initial migration**

```powershell
cd F:\Verkku\FuerzaCivil\backend\FuerzaCivil.Api
dotnet ef migrations add InitialCreate
```

Expected: `Build succeeded.` Migration files created in `Migrations/`.

- [ ] **Step 3: Write SeedData.cs**

```csharp
using NetTopologySuite.Geometries;
using FuerzaCivil.Api.Models;

namespace FuerzaCivil.Api.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext db)
    {
        if (db.PuntosInteres.Any()) return;

        db.PuntosInteres.AddRange(
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000001"), Tipo = TipoPuntoInteres.centro_acopio, Nombre = "Centro Comunitario Guatire", Ubicacion = new Point(-66.5485, 10.4709) { SRID = 4326 }, Direccion = "Avenida Principal, Guatire", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Juan García", Telefono = "0424-1234567", Capacidad = 500, DonacionesRecibidas = 350, Beneficiarios = 420, EstadoOperativo = "activo", TiposDonacion = new[] { "alimentos", "medicinas", "ropa" } },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000002"), Tipo = TipoPuntoInteres.centro_acopio, Nombre = "Iglesia San José", Ubicacion = new Point(-66.545, 10.480) { SRID = 4326 }, Direccion = "Calle 5, Guatire Centro", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "María López", Telefono = "0416-9876543", Capacidad = 300, DonacionesRecibidas = 280, Beneficiarios = 350, EstadoOperativo = "activo", TiposDonacion = new[] { "alimentos", "agua", "higiene" } },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000003"), Tipo = TipoPuntoInteres.centro_medico, Nombre = "Ambulatorio Dr. Francisco Risquez", Ubicacion = new Point(-66.552, 10.468) { SRID = 4326 }, Direccion = "Sector Los Pinos, Guatire", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Dr. Carlos Ruiz", Telefono = "0412-5555555", Capacidad = 200, DonacionesRecibidas = 150, Beneficiarios = 180, EstadoOperativo = "parcial", TiposDonacion = new[] { "medicinas", "suministros medicos" } },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000004"), Tipo = TipoPuntoInteres.institucion, Nombre = "Escuela Primaria Bolívar", Ubicacion = new Point(-66.542, 10.475) { SRID = 4326 }, Direccion = "Carrera 2, Sector Este", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Prof. Andrea Martín", Telefono = "0414-7777777", Capacidad = 400, DonacionesRecibidas = 320, Beneficiarios = 500, EstadoOperativo = "activo", TiposDonacion = new[] { "alimentos", "ropa", "libros" } },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000005"), Tipo = TipoPuntoInteres.centro_medico, Nombre = "CDI Valle Verde", Ubicacion = new Point(-66.540, 10.482) { SRID = 4326 }, Direccion = "Calle Principal, Sector Valle Verde", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Dra. Elena Martínez", Telefono = "0424-1112233", Capacidad = 150, DonacionesRecibidas = 90, Beneficiarios = 200, EstadoOperativo = "activo", TiposDonacion = new[] { "medicinas", "higiene" } },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000006"), Tipo = TipoPuntoInteres.albergue, Nombre = "Refugio Municipal Zamora", Ubicacion = new Point(-66.545, 10.465) { SRID = 4326 }, Direccion = "Calle Bolívar, Sector Centro", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Luis Fernández", Telefono = "0416-9988776", Capacidad = 300, DonacionesRecibidas = 180, Beneficiarios = 250, EstadoOperativo = "activo", TiposDonacion = new[] { "alimentos", "agua", "ropa", "higiene" } },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000007"), Tipo = TipoPuntoInteres.institucion, Nombre = "Alcaldía de Zamora", Ubicacion = new Point(-66.550, 10.472) { SRID = 4326 }, Direccion = "Plaza Bolívar, Guatire Centro", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Oficina de Atención Ciudadana", Telefono = "0212-3000000", Capacidad = 0, EstadoOperativo = "activo" },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000008"), Tipo = TipoPuntoInteres.zona_segura, Nombre = "Zona Segura Parque Guatire", Ubicacion = new Point(-66.535, 10.478) { SRID = 4326 }, Direccion = "Parque Central, Av. Intercomunal", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Protección Civil Zamora", Telefono = "0424-5551122", Capacidad = 1000, EstadoOperativo = "activo" },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000009"), Tipo = TipoPuntoInteres.punto_agua, Nombre = "Punto de Agua Comunidad El Rodeo", Ubicacion = new Point(-66.550, 10.464) { SRID = 4326 }, Direccion = "Sector El Rodeo, vía principal", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Comité de Agua El Rodeo", Telefono = "0412-3344556", Capacidad = 5000, DonacionesRecibidas = 2000, Beneficiarios = 800, EstadoOperativo = "activo", TiposDonacion = new[] { "agua" } },
            new PuntoInteres { Id = Guid.Parse("10000000-0000-0000-0000-000000000010"), Tipo = TipoPuntoInteres.punto_distribucion, Nombre = "Punto de Distribución Mercal Guatire", Ubicacion = new Point(-66.538, 10.473) { SRID = 4326 }, Direccion = "Av. Principal, frente a la plaza", Ciudad = "Guatire", Municipio = "Zamora", Estado = "Miranda", Responsable = "Coordinación CLAP Zamora", Telefono = "0426-7788990", Capacidad = 2000, DonacionesRecibidas = 1200, Beneficiarios = 1500, EstadoOperativo = "activo", TiposDonacion = new[] { "alimentos", "higiene" } }
        );

        db.Insumos.AddRange(
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000001"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000001"), Nombre = "Arroz blanco", Categoria = "alimentos", Prioridad = "critica", CantidadNecesaria = 500, CantidadDisponible = 120, Unidad = "kg" },
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000002"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000001"), Nombre = "Agua potable", Categoria = "agua", Prioridad = "critica", CantidadNecesaria = 1000, CantidadDisponible = 300, Unidad = "L" },
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000003"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000001"), Nombre = "Paracetamol", Categoria = "medicinas", Prioridad = "alta", CantidadNecesaria = 100, CantidadDisponible = 45, Unidad = "cajas" },
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000004"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000002"), Nombre = "Harina de maíz", Categoria = "alimentos", Prioridad = "critica", CantidadNecesaria = 300, CantidadDisponible = 200, Unidad = "kg" },
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000005"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000002"), Nombre = "Botellas de agua", Categoria = "agua", Prioridad = "critica", CantidadNecesaria = 500, CantidadDisponible = 100, Unidad = "botellas" },
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000006"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000003"), Nombre = "Gasas estériles", Categoria = "medicinas", Prioridad = "critica", CantidadNecesaria = 500, CantidadDisponible = 100, Unidad = "paquetes" },
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000007"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000006"), Nombre = "Colchonetas", Categoria = "ropa", Prioridad = "critica", CantidadNecesaria = 150, CantidadDisponible = 40, Unidad = "unidades" },
            new Insumo { Id = Guid.Parse("20000000-0000-0000-0000-000000000008"), PuntoInteresId = Guid.Parse("10000000-0000-0000-0000-000000000006"), Nombre = "Agua embotellada", Categoria = "agua", Prioridad = "critica", CantidadNecesaria = 800, CantidadDisponible = 200, Unidad = "L" }
        );

        db.ZonasAfectadas.AddRange(
            new ZonaAfectada { Ubicacion = new Point(-66.5485, 10.4709) { SRID = 4326 }, Intensidad = 0.9, RadioKm = 0.8, Descripcion = "Zona centro - alta densidad de afectados" },
            new ZonaAfectada { Ubicacion = new Point(-66.545, 10.480) { SRID = 4326 }, Intensidad = 0.7, RadioKm = 0.5, Descripcion = "Casco histórico - daños moderados" },
            new ZonaAfectada { Ubicacion = new Point(-66.552, 10.468) { SRID = 4326 }, Intensidad = 1.0, RadioKm = 0.6, Descripcion = "Los Pinos - zona severamente afectada" },
            new ZonaAfectada { Ubicacion = new Point(-66.542, 10.475) { SRID = 4326 }, Intensidad = 0.5, RadioKm = 0.4, Descripcion = "Sector Este - afectación leve" },
            new ZonaAfectada { Ubicacion = new Point(-66.540, 10.482) { SRID = 4326 }, Intensidad = 0.6, RadioKm = 0.5, Descripcion = "Valle Verde - afectación moderada" },
            new ZonaAfectada { Ubicacion = new Point(-66.545, 10.465) { SRID = 4326 }, Intensidad = 0.8, RadioKm = 0.7, Descripcion = "Zona sur - alta afectación" },
            new ZonaAfectada { Ubicacion = new Point(-66.550, 10.472) { SRID = 4326 }, Intensidad = 0.4, RadioKm = 0.3, Descripcion = "Plaza Bolívar - daños leves" },
            new ZonaAfectada { Ubicacion = new Point(-66.550, 10.464) { SRID = 4326 }, Intensidad = 0.95, RadioKm = 0.9, Descripcion = "El Rodeo - zona crítica" },
            new ZonaAfectada { Ubicacion = new Point(-66.535, 10.478) { SRID = 4326 }, Intensidad = 0.3, RadioKm = 0.4, Descripcion = "Parque Central - zona de concentración" },
            new ZonaAfectada { Ubicacion = new Point(-66.538, 10.473) { SRID = 4326 }, Intensidad = 0.75, RadioKm = 0.5, Descripcion = "Zona comercial - afectación considerable" }
        );

        db.ConfigApp.Add(new ConfigApp
        {
            LatitudDefault = 10.4709, LongitudDefault = -66.5485, ZoomDefault = 13,
            Municipio = "Zamora", Estado = "Miranda", Pais = "Venezuela"
        });

        db.SaveChanges();
    }
}
```

- [ ] **Step 4: Add seed call to Program.cs**

Add this line after `var app = builder.Build();`:

```csharp
// Seed database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    SeedData.Initialize(db);
}
```

- [ ] **Step 5: Verify build**

```powershell
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 6: Commit**

```bash
git add backend/FuerzaCivil.Api/Data/SeedData.cs backend/FuerzaCivil.Api/Program.cs backend/FuerzaCivil.Api/Migrations/
git commit -m "feat: add initial migration, seed data, and auto-migrate on startup"
```

---

### Task 10: Verify final build and document

**Files:**
- None (verification only)

- [ ] **Step 1: Full build from root**

```powershell
cd F:\Verkku\FuerzaCivil\frontend
npm run build
cd ..\backend\FuerzaCivil.Api
dotnet build
```

Expected: Both build successfully.

- [ ] **Step 2: Verify project structure**

```
FuerzaCivil/
├── frontend/          ← Next.js (builds)
├── backend/
│   └── FuerzaCivil.Api/
│       ├── Controllers/ (6 files)
│       ├── Models/ (4 files)
│       ├── DTOs/ (5 files)
│       ├── Data/ (2 files: DbContext + Seed)
│       ├── Migrations/
│       └── Program.cs
└── docs/
    └── superpowers/
        ├── specs/
        └── plans/
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: finalize monorepo structure with frontend + backend + docs"
```

---

## Self-Review

1. **Spec coverage**: Directory restructure ✓ (Task 1), .NET 10 API ✓ (Task 2), EF Core + Npgsql + PostGIS ✓ (Tasks 3+6), Auth0 JWT ✓ (Task 7), All controllers ✓ (Task 8), Migrations + seed ✓ (Task 9), Docs structure ✓ (Task 1).

2. **Placeholder scan**: No TBDs or TODOs. All code fully written. Auth0 config uses placeholder domain (expected — user provides their own).

3. **Type consistency**: Models → DTOs → Controllers mapping is consistent. `Point` uses (lng, lat) from NTS. FK relationships correct (`PuntoInteresId` → `PuntosInteres.Id`).
