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
