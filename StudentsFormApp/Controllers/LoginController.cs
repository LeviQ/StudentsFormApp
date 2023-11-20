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
                var hashedPassword = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(loginRequest.Password)));

                //Wyszukanie studenta w bazie danych po numerze albumu i hashowanym haśle
                var student = await _context.Students.FirstOrDefaultAsync(s => s.AlbumNumber == loginRequest.AlbumNumber && s.StudentPasswordHash == hashedPassword);

                if (student != null)
                {
                    var jwtSettings = _configuration.GetSection("JwtSettings");
                    var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

                    var claims = new List<Claim>
                    {
                        new Claim("ID", student.ID.ToString()),
                        new Claim("AlbumNumber", student.AlbumNumber.ToString()),
                        new Claim("FieldOfStudy", student.FieldOfStudy),
                        new Claim("GroupID", student.GroupID.ToString()),
                        new Claim("Semester", student.Semester.ToString())
                    };

                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(claims),
                        Expires = DateTime.UtcNow.AddDays(1), // Token wygasa po 1 dniu
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
                    if (await _context.Students.AnyAsync(s => s.AlbumNumber == loginRequest.AlbumNumber))
                    {
                        if (await _context.Students.AnyAsync(s => s.StudentPasswordHash != hashedPassword))
                        {
                            return Unauthorized("Wprowadzono niepoprawne hasło.");
                        }
                    }
                    return Unauthorized("Wprowadź poprawny numer albumu.");
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
