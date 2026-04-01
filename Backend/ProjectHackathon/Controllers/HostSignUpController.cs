using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HostSignUpController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string connectionString;

        public HostSignUpController(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        [HttpPost("signup")]
        public IActionResult Signup([FromBody] HostSignUp s)
        {
            try
            {
                SqlConnection con = new SqlConnection(connectionString);

                string query = @"
                INSERT INTO Host
                (HostName, HostType, OrganizationName, Email, Country, City, Username, UserPassword)
                VALUES
                (@HostName, @HostType, @OrganizationName, @Email, @Country, @City, @Username, @UserPassword)";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@HostName", s.HostName);
                cmd.Parameters.AddWithValue("@HostType", s.HostType);
                cmd.Parameters.AddWithValue("@OrganizationName", s.OrganizationName);
                cmd.Parameters.AddWithValue("@Email", s.Email);
                cmd.Parameters.AddWithValue("@Country", s.Country);
                cmd.Parameters.AddWithValue("@City", s.City);
                cmd.Parameters.AddWithValue("@Username", s.Username);
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(s.UserPassword);
                cmd.Parameters.AddWithValue("@UserPassword", hashedPassword);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();

                return Ok(new { message = "Signup successful. Please wait for admin approval before logging in." });
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
