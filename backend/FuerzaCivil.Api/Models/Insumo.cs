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
