using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> Login(Student student)
        {
            if (ModelState.IsValid)
            {
                // Pobranie studenta z bazy na podstawie numeru albumu
                var existingStudent = await _context.Students.FirstOrDefaultAsync(s => s.AlbumNumber == student.AlbumNumber);
                if (existingStudent == null)
                {
                    return Unauthorized("Nieprawidłowy numer albumu lub hasło.");
                }

                // Porównanie hashowanych haseł
                var enteredPasswordHash = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(student.StudentPasswordHash)));
                if (existingStudent.StudentPasswordHash != enteredPasswordHash)
                {
                    return Unauthorized("Nieprawidłowy numer albumu lub hasło.");
                }

                return Ok("Logowanie zakończone pomyślnie.");
            }
            return BadRequest("Niepoprawne dane.");
        }
    }
}
