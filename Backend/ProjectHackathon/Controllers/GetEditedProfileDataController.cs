using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class GetEditedProfileDataController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GetEditedProfileDataController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetProfile/{id}")]
        public IActionResult GetProfile(int id)
        {
            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            string query = @"SELECT Skill,Place,GithubLink,Bio,ProfileImage
                     FROM ParticipantsProfile 
                     WHERE ParticipantsID=@id";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@id", id);

            con.Open();
            SqlDataReader dr = cmd.ExecuteReader();

            if (dr.Read())
            {
                var result = Ok(new
                {
                    Skill = dr["Skill"]?.ToString(),
                    Place = dr["Place"]?.ToString(),
                    Github = dr["GithubLink"]?.ToString(),
                    Bio = dr["Bio"]?.ToString(),
                    Image = dr["ProfileImage"] == DBNull.Value ? null : Convert.ToBase64String((byte[])dr["ProfileImage"])
                });
                con.Close();
                return result;
            }

            con.Close();
            // Return empty profile data instead of 404 to satisfy frontend
            return Ok(new
            {
                Skill = (string)null,
                Place = (string)null,
                Github = (string)null,
                Bio = (string)null,
                Image = (string)null
            });
        }
    }
}
