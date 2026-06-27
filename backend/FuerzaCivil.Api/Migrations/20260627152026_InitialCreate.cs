using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace FuerzaCivil.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:postgis", ",,");

            migrationBuilder.CreateTable(
                name: "config_app",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    LatitudDefault = table.Column<double>(type: "double precision", nullable: false),
                    LongitudDefault = table.Column<double>(type: "double precision", nullable: false),
                    ZoomDefault = table.Column<int>(type: "integer", nullable: false),
                    Municipio = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Estado = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Pais = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_config_app", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "puntos_interes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<string>(type: "varchar(30)", nullable: false),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Ubicacion = table.Column<Point>(type: "geography(Point, 4326)", nullable: false),
                    Direccion = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Ciudad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Municipio = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Estado = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Responsable = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Capacidad = table.Column<int>(type: "integer", nullable: false),
                    DonacionesRecibidas = table.Column<int>(type: "integer", nullable: false),
                    Beneficiarios = table.Column<int>(type: "integer", nullable: false),
                    EstadoOperativo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    TiposDonacion = table.Column<string[]>(type: "text[]", nullable: false),
                    UltimaActualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_puntos_interes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "zonas_afectadas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Ubicacion = table.Column<Point>(type: "geography(Point, 4326)", nullable: false),
                    Intensidad = table.Column<double>(type: "double precision", nullable: false),
                    RadioKm = table.Column<double>(type: "double precision", nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ReportadoPor = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    FechaReporte = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_zonas_afectadas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "insumos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PuntoInteresId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Categoria = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Prioridad = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CantidadNecesaria = table.Column<int>(type: "integer", nullable: false),
                    CantidadDisponible = table.Column<int>(type: "integer", nullable: false),
                    Unidad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_insumos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_insumos_puntos_interes_PuntoInteresId",
                        column: x => x.PuntoInteresId,
                        principalTable: "puntos_interes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_insumos_PuntoInteresId",
                table: "insumos",
                column: "PuntoInteresId");

            migrationBuilder.CreateIndex(
                name: "IX_puntos_interes_Tipo",
                table: "puntos_interes",
                column: "Tipo");

            migrationBuilder.CreateIndex(
                name: "IX_puntos_interes_Ubicacion",
                table: "puntos_interes",
                column: "Ubicacion")
                .Annotation("Npgsql:IndexMethod", "GIST");

            migrationBuilder.CreateIndex(
                name: "IX_zonas_afectadas_Ubicacion",
                table: "zonas_afectadas",
                column: "Ubicacion")
                .Annotation("Npgsql:IndexMethod", "GIST");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "config_app");

            migrationBuilder.DropTable(
                name: "insumos");

            migrationBuilder.DropTable(
                name: "zonas_afectadas");

            migrationBuilder.DropTable(
                name: "puntos_interes");
        }
    }
}
