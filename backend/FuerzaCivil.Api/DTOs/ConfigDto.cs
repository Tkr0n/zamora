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
