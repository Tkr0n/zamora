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
