using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class GetProfileDataController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GetProfileDataController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetProfile/{id}")]
        public IActionResult GetProfile(int id)
        {
            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            string query = @"SELECT Firstname,Lastname,Email,Degree,Collegename
                     FROM Participants 
                     WHERE ParticipantsID=@id";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@id", id);

            con.Open();
            SqlDataReader dr = cmd.ExecuteReader();

            if (dr.Read())
            {
                return Ok(new
                {
                    Name = dr["Firstname"] + " " + dr["Lastname"],
                    Email = dr["Email"].ToString(),
                    Qualification = dr["Degree"].ToString(),
                    College = dr["Collegename"].ToString()
                });
            }

            con.Close();
            return NotFound();
        }
    }
}
