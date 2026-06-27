# Backend .NET 10 + Restructuración Monorepo

**Fecha**: 2026-06-27
**Estado**: Diseño aprobado

## Resumen

Reorganizar el proyecto en estructura monorepo (`frontend/`, `backend/`, `docs/`) y crear una API .NET 10 con PostgreSQL + PostGIS, autenticación Auth0, y CRUD completo para todas las entidades del sistema.

## Stack Backend

| Capa | Tecnología |
|------|-----------|
| Runtime | .NET 10 (net10.0) |
| ORM | Entity Framework Core 10 |
| DB | PostgreSQL 17 + PostGIS |
| Auth | Auth0 (JWT validation server-side) |
| Geo | NetTopologySuite + Npgsql.NetTopologySuite |

## Estructura del monorepo

```
FuerzaCivil/
├── frontend/               ← Next.js actual
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/                ← .NET 10 Web API
│   ├── Controllers/
│   │   ├── PuntosInteresController.cs
│   │   ├── ZonasAfectadasController.cs
│   │   ├── InsumosController.cs
│   │   ├── ConfigController.cs
│   │   ├── EstadisticasController.cs
│   │   └── ReportesController.cs
│   ├── Models/
│   │   ├── PuntoInteres.cs
│   │   ├── ZonaAfectada.cs
│   │   ├── Insumo.cs
│   │   └── ConfigApp.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── DTOs/
│   ├── Program.cs
│   └── backend.csproj
└── docs/                   ← documentación
    └── superpowers/
        ├── specs/
        └── plans/
```

## Endpoints

| Controller | Método | Ruta | Auth |
|-----------|--------|------|------|
| PuntosInteres | GET | /api/puntos-interes | Público |
| PuntosInteres | GET | /api/puntos-interes/{id} | Público |
| PuntosInteres | POST | /api/puntos-interes | Admin |
| PuntosInteres | PUT | /api/puntos-interes/{id} | Admin |
| PuntosInteres | DELETE | /api/puntos-interes/{id} | Admin |
| Insumos | GET | /api/insumos?puntoInteresId={id} | Público |
| Insumos | POST | /api/insumos | Admin |
| Insumos | PUT | /api/insumos/{id} | Admin |
| Insumos | DELETE | /api/insumos/{id} | Admin |
| ZonasAfectadas | GET | /api/zonas-afectadas | Público |
| ZonasAfectadas | POST | /api/zonas-afectadas | Admin |
| ZonasAfectadas | PUT | /api/zonas-afectadas/{id} | Admin |
| ZonasAfectadas | DELETE | /api/zonas-afectadas/{id} | Admin |
| Config | GET | /api/config | Público |
| Config | PUT | /api/config | Admin |
| Estadisticas | GET | /api/estadisticas | Admin |
| Reportes | POST | /api/reportes | Público (rate-limited) |

## Esquema DB

- `puntos_interes`: tipo (7 tipos), nombre, ubicacion GEOGRAPHY(POINT), direccion, responsable, telefono, capacidad, donaciones_recibidas, beneficiarios, estado_operativo, tipos_donacion TEXT[]
- `insumos`: FK a puntos_interes, nombre, categoria, prioridad, cantidades, unidad
- `zonas_afectadas`: ubicacion GEOGRAPHY(POINT), intensidad (0-1), radio_km, descripcion, reportado_por
- `config_app`: tabla singleton (id=1), coordenadas default, municipio, estado, pais

## Auth0 Integration

- Frontend: Auth0 React SDK para login
- Backend: `AddAuthentication().AddJwtBearer()` validando tokens contra el dominio Auth0
- Roles: claim `permissions` con scopes `read:public` y `write:admin`
- Endpoints públicos sin `[Authorize]`, admin con `[Authorize("write:admin")]`
