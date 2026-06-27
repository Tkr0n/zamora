using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using FuerzaCivil.Api.DTOs;

namespace FuerzaCivil.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config) => _config = config;

    [HttpPost("login")]
    public ActionResult<LoginResponseDto> Login(LoginDto dto)
    {
        var adminEmail = _config["Admin:Email"];
        var adminPassword = _config["Admin:Password"];

        if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
            return StatusCode(503, "Autenticación no configurada");

        if (!string.Equals(dto.Email, adminEmail, StringComparison.OrdinalIgnoreCase)
            || dto.Password != adminPassword)
            return Unauthorized(new { message = "Credenciales inválidas" });

        var expiresAt = DateTime.UtcNow.AddHours(12);
        var token = GenerateToken(dto.Email, expiresAt);
        return Ok(new LoginResponseDto(token, dto.Email, expiresAt));
    }

    private string GenerateToken(string email, DateTime expiresAt)
    {
        var secret = _config["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret no configurado");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, "admin"),
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "fuerzacivil",
            audience: _config["Jwt:Audience"] ?? "fuerzacivil-web",
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
