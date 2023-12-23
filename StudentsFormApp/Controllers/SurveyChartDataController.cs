using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Security.Cryptography;
using static StudentsFormApp.Controllers.SurveysController;

namespace StudentsFormApp.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SurveyChartDataController : ControllerBase
    {
        private readonly StudentContext _context;

        public SurveyChartDataController(StudentContext context)
        {
            _context = context;
        }

        [HttpGet("GetSurveyChartData")]
        public async Task<ActionResult<IEnumerable<SurveyChartDataDto>>> GetSurveyChartData(int offeringId)
        {
            var surveyResponses = await _context.SurveyResponses
                .Where(sr => sr.OfferingID == offeringId)
                .ToListAsync();

            var courseOfferingDetails = await _context.CourseOfferings
                .Where(co => co.OfferingID == offeringId)
                .Select(co => new
                {
                    co.SubjectID,
                    co.InstructorID,
                    co.ClassTypeID,
                })
                .FirstOrDefaultAsync();

            if (courseOfferingDetails == null)
            {
                return NotFound("Offering not found.");
            }

            var subjectName = await _context.Subjects
                .Where(s => s.SubjectID == courseOfferingDetails.SubjectID)
                .Select(s => s.SubjectName)
                .FirstOrDefaultAsync();

            var instructorTitle = await _context.Instructors
                .Where(i => i.InstructorID == courseOfferingDetails.InstructorID)
                .Select(i => i.Title)
                .FirstOrDefaultAsync();

            var instructorName = await _context.Instructors
                .Where(i => i.InstructorID == courseOfferingDetails.InstructorID)
                .Select(i => i.Name)
                .FirstOrDefaultAsync();

            var classTypeName = await _context.ClassTypes
                .Where(ct => ct.ClassTypeID == courseOfferingDetails.ClassTypeID)
                .Select(ct => ct.TypeName)
                .FirstOrDefaultAsync();

            //// Odpowiedzi na pytania w postaci list:

            var answer1Stats = surveyResponses
                .Select(sr => sr.Answer1)
                .ToList();

            var answer2Stats = surveyResponses
                .Select(sr => sr.Answer2)
                .ToList();

            var answer3Stats = surveyResponses
                .Select(sr => sr.Answer3)
                .ToList();

            var answer4Stats = surveyResponses
                .Select(sr => sr.Answer4)
                .ToList();

            var answer5Stats = surveyResponses
                .Select(sr => sr.Answer5)
                .ToList();

            var answer6Stats = surveyResponses
                .Select(sr => sr.Answer6)
                .ToList();

            var answer7Stats = surveyResponses
                .Select(sr => sr.Answer7)
                .ToList();

            var openanswer = surveyResponses
                .Select(sr => sr.OpenQuestion)
                .ToList();

            var chartData = new SurveyChartDataDto
            {
                SubjectName = subjectName,
                InstructorTitle = instructorTitle,
                InstructorName = instructorName,
                ClassTypeName = classTypeName,
                Answer1Data = answer1Stats,
                Answer2Data = answer2Stats,
                Answer3Data = answer3Stats,
                Answer4Data = answer4Stats,
                Answer5Data = answer5Stats,
                Answer6Data = answer6Stats,
                Answer7Data = answer7Stats,
                OpenAnswer = openanswer,
            };

            return Ok(chartData);
        }

        public class SurveyChartDataDto
        {
            public string SubjectName { get; set; }
            public string InstructorTitle { get; set; }
            public string InstructorName { get; set; }
            public string ClassTypeName { get; set; }
            public List<int>? Answer1Data { get; set; }
            public List<int>? Answer2Data { get; set; }
            public List<int>? Answer3Data { get; set; }
            public List<int>? Answer4Data { get; set; }
            public List<int>? Answer5Data { get; set; }
            public List<int>? Answer6Data { get; set; }
            public List<int>? Answer7Data { get; set; }
            public List<string>? OpenAnswer { get; set; }
        }
    }
}

