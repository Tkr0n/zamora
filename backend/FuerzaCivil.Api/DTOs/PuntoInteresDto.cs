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
