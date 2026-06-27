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
