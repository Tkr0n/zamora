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
