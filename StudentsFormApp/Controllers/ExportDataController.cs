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

namespace StudentsFormApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExportDataController : ControllerBase
    {
        private readonly StudentContext _context;
        private readonly IConfiguration _configuration;

        public ExportDataController(StudentContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("export-instructors")]
        public IActionResult ExportInstructors()
        {
            var instructors = _context.Instructors.ToList();
            var json = JsonConvert.SerializeObject(instructors, Formatting.Indented);
            return File(Encoding.UTF8.GetBytes(json), "application/json", "Instructors.json");
        }

        [HttpGet("export-subjects")]
        public IActionResult ExportSubjects()
        {
            var subjects = _context.Subjects.ToList();
            var json = JsonConvert.SerializeObject(subjects, Formatting.Indented);
            return File(Encoding.UTF8.GetBytes(json), "application/json", "Subjects.json");
        }

        [HttpGet("export-offerings")]
        public IActionResult ExportOfferings()
        {
            var offerings = _context.CourseOfferings.ToList();
            var json = JsonConvert.SerializeObject(offerings, Formatting.Indented);
            return File(Encoding.UTF8.GetBytes(json), "application/json", "Offerings.json");
        }

        [HttpGet("export-studentgroups")]
        public IActionResult ExportStudentGroups()
        {
            var offerings = _context.StudentGroups.ToList();
            var json = JsonConvert.SerializeObject(offerings, Formatting.Indented);
            return File(Encoding.UTF8.GetBytes(json), "application/json", "Offerings.json");
        }

        [HttpGet("export-classtypes")]
        public IActionResult ExportClassTypes()
        {
            var classtypes = _context.ClassTypes.ToList();
            var json = JsonConvert.SerializeObject(classtypes, Formatting.Indented);
            return File(Encoding.UTF8.GetBytes(json), "application/json", "ClassTypes.json");
        }
    }
}
