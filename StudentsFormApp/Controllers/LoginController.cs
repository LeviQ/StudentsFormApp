using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace StudentsFormApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly StudentContext _context;
        private readonly IConfiguration _configuration;

        public LoginController(StudentContext context, IConfiguration configuration )
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login(StudentLoginRequest loginRequest)
        {
            if (ModelState.IsValid)
            {
                // Hashowanie hasła przesłanego przez studenta
                var hashedPassword = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(loginRequest.Password)));

                // Wyszukanie studenta w bazie danych po numerze albumu i hashowanym haśle
                var student = await _context.Students.FirstOrDefaultAsync(s => s.AlbumNumber == loginRequest.AlbumNumber && s.StudentPasswordHash == hashedPassword);

                if (student != null)
                {
                    var jwtSettings = _configuration.GetSection("JwtSettings");
                    var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                    new Claim(ClaimTypes.Name, student.AlbumNumber.ToString())
                            // możesz dodać więcej claimów, jeśli chcesz
                        }),
                        Expires = DateTime.UtcNow.AddDays(1), // Token wygasa po 1 dniu, możesz dostosować
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                        Issuer = jwtSettings["Issuer"],
                        Audience = jwtSettings["Audience"]
                    };

                    var tokenHandler = new JwtSecurityTokenHandler();
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    var tokenString = tokenHandler.WriteToken(token);

                    return Ok(new { Token = tokenString, Message = "Zalogowano pomyślnie." }); 
                }
                else
                {
                    return Unauthorized("Niepoprawny numer albumu lub hasło.");
                }
            }
            return BadRequest("Niepoprawne dane.");
        }
    }

    public class StudentLoginRequest
    {
        public int AlbumNumber { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}
