using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SuaLoja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Simulação de banco de dados (Usuário Comum e Administrador)
            string role = "";
            if (model.Usuario == "admin" && model.Senha == "123") role = "Administrador";
            else if (model.Usuario == "comum" && model.Senha == "123") role = "Comum";
            else return Unauthorized(new { message = "Usuário ou senha inválidos" });

            // Gerar o Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("EstaESuaChaveSuperSecretaMuitoLongaParaJWT");
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, model.Usuario),
                    new Claim(ClaimTypes.Role, role) // Define a permissão (Autorização)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { token = tokenHandler.WriteToken(token), role = role });
        }
    }

    public class LoginModel
    {
        public string Usuario { get; set; }
        public string Senha { get; set; }
    }
}