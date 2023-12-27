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
using Newtonsoft.Json;
using StudentsFormApp.Models;

namespace StudentsFormApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImportDataController : ControllerBase
    {
        private readonly StudentContext _context;
        private readonly IConfiguration _configuration;

        public ImportDataController(StudentContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("import-instructors")]
        public async Task<IActionResult> ImportInstructors(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Błędny plik!");

            using (var stream = new StreamReader(file.OpenReadStream()))
            {
                var jsonContent = await stream.ReadToEndAsync();
                var importedInstructors = JsonConvert.DeserializeObject<List<Instructor>>(jsonContent);

                foreach (var importedInstructor in importedInstructors)
                {
                    var existingInstructor = await _context.Instructors
                        .FirstOrDefaultAsync(i => i.InstructorID == importedInstructor.InstructorID);

                    if (existingInstructor != null)
                    {
                        _context.Entry(existingInstructor).CurrentValues.SetValues(importedInstructor);
                    }
                    else
                    {
                        importedInstructor.InstructorID = 0;
                        await _context.Instructors.AddAsync(importedInstructor);
                    }
                }
                await _context.SaveChangesAsync();
                
                return Ok();
            }
        }

        [HttpPost("import-subjects")]
        public async Task<IActionResult> ImportSubjects(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Błędny plik!");

            using (var stream = new StreamReader(file.OpenReadStream()))
            {
                var jsonContent = await stream.ReadToEndAsync();
                var importedSubjects = JsonConvert.DeserializeObject<List<Subject>>(jsonContent);

                foreach (var importedSubject in importedSubjects)
                {
                    var existingSubject = await _context.Subjects
                        .FirstOrDefaultAsync(i => i.SubjectID == importedSubject.SubjectID);

                    if (existingSubject != null)
                    {
                        _context.Entry(existingSubject).CurrentValues.SetValues(importedSubject);
                    }
                    else
                    {
                        importedSubject.SubjectID = 0;
                        await _context.Subjects.AddAsync(importedSubject);
                    }
                }
                await _context.SaveChangesAsync();
               
                return Ok();
            }
        }

        [HttpPost("import-courseofferings")]
        public async Task<IActionResult> ImportCourseOfferings(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Błędny plik!");

            using (var stream = new StreamReader(file.OpenReadStream()))
            {
                var jsonContent = await stream.ReadToEndAsync();
                var importedCourseOfferings = JsonConvert.DeserializeObject<List<CourseOffering>>(jsonContent);

                foreach (var importedCourseOffering in importedCourseOfferings)
                {
                    var existingCourseOffering = await _context.CourseOfferings
                        .FirstOrDefaultAsync(i => i.OfferingID == importedCourseOffering.OfferingID);

                    if (existingCourseOffering != null)
                    {
                        _context.Entry(existingCourseOffering).CurrentValues.SetValues(importedCourseOfferings);
                    }
                    else
                    {
                        importedCourseOffering.OfferingID = 0;
                        await _context.CourseOfferings.AddAsync(importedCourseOffering);
                    }
                }
                await _context.SaveChangesAsync();


                return Ok();
            }
        }

    }
}
