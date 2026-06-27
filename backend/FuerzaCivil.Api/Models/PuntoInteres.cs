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
