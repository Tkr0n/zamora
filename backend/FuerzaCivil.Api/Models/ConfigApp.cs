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
