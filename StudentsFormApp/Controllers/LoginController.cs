using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Security.Cryptography;

namespace StudentsFormApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly StudentContext _context;

        public LoginController(StudentContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            if (ModelState.IsValid)
            {
                // Wyszukaj studenta na podstawie podanego numeru albumu
                var student = await _context.Students.FirstOrDefaultAsync(s => s.AlbumNumber == loginRequest.AlbumNumber);

                if (student == null)
                {
                    return BadRequest("Niepoprawny numer albumu lub hasło.");
                }

                // Sprawdzenie hasła
                var hashedPassword = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(loginRequest.StudentPasswordHash)));

                if (student.StudentPasswordHash != hashedPassword)
                {
                    return BadRequest("Niepoprawny numer albumu lub hasło.");
                }

                // W tym miejscu logowanie przebiegło pomyślnie, możesz zwrócić np. token JWT lub cokolwiek innego
                return Ok("Logowanie pomyślne.");
            }
            return BadRequest("Niepoprawne dane.");
        }
    }

    public class LoginRequest
    {
        public int AlbumNumber { get; set; }
        public string StudentPasswordHash { get; set; }
    }
}
