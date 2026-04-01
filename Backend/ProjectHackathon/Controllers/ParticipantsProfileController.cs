using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;
using System.Data;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class ParticipantsProfileController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ParticipantsProfileController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("SaveProfile")]
        public async Task<IActionResult> SaveProfile([FromForm] ParticipantsProfile p)
        {
            byte[] img = null;

            if (p.ImageFile != null)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    await p.ImageFile.CopyToAsync(ms);
                    img = ms.ToArray();
                }
            }

            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            SqlCommand cmd = new SqlCommand("SaveParticipantsProfile", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@ParticipantsID", p.ParticipantsID);
            cmd.Parameters.AddWithValue("@Skill", (object)p.Skill ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Place", (object)p.Place ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GithubLink", (object)p.GithubLink ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Bio", (object)p.Bio ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ProfileImage", (object)img ?? DBNull.Value);

            con.Open();
            cmd.ExecuteNonQuery();
            con.Close();
                
            return Ok("Profile Saved");
        }
    }
}
