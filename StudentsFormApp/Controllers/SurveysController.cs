using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using StudentsFormApp.Models;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace StudentsFormApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurveysController : ControllerBase
    {
        private readonly StudentContext _context;


        public SurveysController(StudentContext context)
        {
            _context = context;
        }

        //GET: api/Surveys
        [HttpGet("GetSurveys")]
        public async Task<IActionResult> GetSurveys()
        {
            // Pobranie ID zalogowanego studenta z tokena JWT

            //var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault().Split(" ").Last();

            var tokenhandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes("TajnyKluczDoGenerowaniaTokenowJWT");

            try
            {
                tokenhandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false


                },
                out SecurityToken validatedtoken
                );

                var jwttoken = (JwtSecurityToken)validatedtoken;
                var studentId = jwttoken.Claims.FirstOrDefault(c => c.Type == "ID")?.Value;

                var student = await _context.Students.FindAsync(int.Parse(studentId));

                // Jeśli student nie został znaleziony, zwróć błąd
                if (student == null)
                {
                    return NotFound("Student not found.");
                }

                var surveys = await _context.CourseOfferings
                    .Where(co => co.Semester == student.Semester &&
                            (co.GroupID == student.GroupID ||
                            co.GroupID == 14 ||
                            (student.GroupID == 8 && co.GroupID == 13) ||
                            (student.GroupID == 9 && co.GroupID == 13) ||
                            (student.GroupID == 10 && co.GroupID == 13)))
                    .Select(co => new SurveyDto
                    {
                        OfferingID = co.OfferingID,
                        SubjectName = co.Subject.SubjectName,
                        InstructorTitle = co.Instructor.Title,
                        InstructorName = co.Instructor.Name,
                        ClassTypeName = co.ClassType.TypeName,
                        GroupName = co.Group.GroupName,
                        Semester = co.Semester
                    }).ToListAsync();

                return Ok(surveys);
            }
            catch ( Exception ex )
            {
                return BadRequest( ex );
            }
        }


        public class SurveyDto
        {
            public int OfferingID { get; set; }
            public string SubjectName { get; set; }
            public string InstructorTitle { get; set; }
            public string InstructorName { get; set; }
            public string ClassTypeName { get; set; }
            public string GroupName { get; set; }
            public int Semester { get; set; }
        }

    }
    
}
