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
    public class RegistrationController : ControllerBase
    {
        private readonly StudentContext _context;

        public RegistrationController(StudentContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Register(Student student)
        {
            if (ModelState.IsValid)
            {
                // Sprawdzenie, czy student o podanym numerze albumu już istnieje
                if (await _context.Students.AnyAsync(s => s.AlbumNumber == student.AlbumNumber))
                {
                    return BadRequest("Student o podanym numerze albumu już istnieje.");
                }

                // Hashowanie hasła (nigdy nie przechowuj hasła w postaci jawnej!)
                student.StudentPasswordHash = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(student.StudentPasswordHash)));

                // Zapisanie studenta w bazie danych
                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                return Ok("Rejestracja zakończona pomyślnie.");
            }
            return BadRequest("Niepoprawne dane.");
        }
    }
}

