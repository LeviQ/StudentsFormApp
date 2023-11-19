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
    public class StudentRegistrationDto
    {
        public int AlbumNumber { get; set; }
        public string StudentPassword { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public int Semester { get; set; }
        public string GroupName { get; set; } = string.Empty;
    }

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
        public async Task<IActionResult> Register(StudentRegistrationDto registrationDto)
        {
            if (ModelState.IsValid)
            {
                var existingStudent = await _context.Students
                    .AnyAsync(s => s.AlbumNumber == registrationDto.AlbumNumber);
                if (existingStudent)
                {
                    return BadRequest("Student o podanym numerze albumu już istnieje.");
                }

                var group = await _context.StudentGroups
                    .FirstOrDefaultAsync(g => g.GroupName == registrationDto.GroupName);
                if (group == null)
                {
                    return BadRequest("Podana grupa studencka nie istnieje.");
                }

                var hashedPassword = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(registrationDto.StudentPassword)));

                var student = new Student
                {
                    AlbumNumber = registrationDto.AlbumNumber,
                    StudentPasswordHash = hashedPassword,
                    FieldOfStudy = registrationDto.FieldOfStudy,
                    Semester = registrationDto.Semester,
                    GroupID = group.GroupID
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                return Ok("Rejestracja zakończona pomyślnie.");
            }
            return BadRequest("Niepoprawne dane.");
        }
    }
}

