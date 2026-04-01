using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsSignUpController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ParticipantsSignUpController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("Signup")]
        public IActionResult Signup([FromBody] ParticipantsSignUP s)
        {
            try
            {
                SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

                string query = @"
                INSERT INTO Participants
                (Firstname, Lastname, Email, Dob, Degree, Collegename, Username, UserPassword)
                VALUES
                (@Firstname, @Lastname, @Email, @Dob, @Degree, @Collegename, @Username, @UserPassword)";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@Firstname", s.Firstname);
                cmd.Parameters.AddWithValue("@Lastname", s.Lastname);
                cmd.Parameters.AddWithValue("@Email", s.Email);
                cmd.Parameters.Add("@Dob", System.Data.SqlDbType.Date).Value = s.Dob;
                cmd.Parameters.AddWithValue("@Degree", s.Degree);
                cmd.Parameters.AddWithValue("@Collegename", s.Collegename);
                cmd.Parameters.AddWithValue("@Username", s.Username);
                string passwordToHash = s.Password.Trim();
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(passwordToHash);
                cmd.Parameters.AddWithValue("@UserPassword", hashedPassword);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return Ok(new { message = "Signup successful" });
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627 || ex.Number == 2601)
                {
                    return BadRequest(new { message = "Username or Email already exists" });
                }

                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
