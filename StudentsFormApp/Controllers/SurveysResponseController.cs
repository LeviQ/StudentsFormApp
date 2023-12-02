using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StudentsFormApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text;

namespace StudentsFormApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurveysResponseController : ControllerBase
    {
        private readonly StudentContext _context;


        public SurveysResponseController(StudentContext context)
        {
            _context = context;
        }

        [HttpPost("SubmitResponse")]
        public async Task<IActionResult> SubmitResponse([FromBody] SurveyResponseDto surveyResponseDto)
        {
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

                var albumNumberClaim = jwttoken.Claims.FirstOrDefault(c => c.Type == "AlbumNumber")?.Value;

                if (albumNumberClaim == null || !int.TryParse(albumNumberClaim, out int albumNumber))
                {
                    return BadRequest("Nieprawidłowy numer albumu");
                }

                var newResponse = new SurveyResponse
                {
                    OfferingID = surveyResponseDto.OfferingID,
                    AlbumNumber = albumNumber,
                    Answer1 = surveyResponseDto.Answer1,
                    Answer2 = surveyResponseDto.Answer2,
                    Answer3 = surveyResponseDto.Answer3,
                    Answer4 = surveyResponseDto.Answer4,
                    Answer5 = surveyResponseDto.Answer5,
                    Answer6 = surveyResponseDto.Answer6,
                    Answer7 = surveyResponseDto.Answer7,
                    OpenQuestion = surveyResponseDto.OpenQuestion,
                };

                _context.SurveyResponses.Add(newResponse);
                await _context.SaveChangesAsync();

                return Ok(newResponse.SurveyResponseID); // Zwraca ID nowo utworzonej odpowiedzi
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        public class SurveyResponseDto
        {
            public int OfferingID { get; set; }
            public int Answer1 { get; set; }
            public int Answer2 { get; set; }
            public int Answer3 { get; set; }
            public int Answer4 { get; set; }
            public int Answer5 { get; set; }
            public int Answer6 { get; set; }
            public int Answer7 { get; set; }
            public string OpenQuestion { get; set; }
        }
    }
}
