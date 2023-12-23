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
    public class StudentGroupDto
    {
        public string GroupName { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class OfferingsController : ControllerBase
    {
        private readonly StudentContext _context;

        public OfferingsController(StudentContext context)
        {
            _context = context;
        }

        [HttpGet("GetOfferings")]
        public async Task<IActionResult> GetOfferingsBySemesterAndGroup(int semester, string groupName)
        {

            var group = await _context.StudentGroups
            .FirstOrDefaultAsync(g => g.GroupName == groupName);
            if (group == null)
            {
                return BadRequest("Podana grupa studencka nie istnieje.");
            }

            var offerings = await _context.CourseOfferings
                .Where(co => co.Semester == semester &&
                            (co.GroupID == group.GroupID ||
                             co.GroupID == 14 ||
                            (group.GroupID == 8 && co.GroupID == 13) ||
                            (group.GroupID == 9 && co.GroupID == 13) ||
                            (group.GroupID == 10 && co.GroupID == 13)))
                .Select(co => new
                {
                    OfferingID = co.OfferingID,

                }).ToListAsync();

            return Ok(offerings);
        }
    }
}

