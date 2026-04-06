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
        private readonly ProjectHackathon.Services.EmailService _emailService;
        private readonly IConfiguration _configuration;
        private string connectionString;

        public HostSignUpController(IConfiguration configuration, ProjectHackathon.Services.EmailService emailService)
        {
            _configuration = configuration;
            _emailService = emailService;
            connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] HostSignUp s)
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

                // Send Welcome Email
                try
                {
                    string subject = "Welcome to NexCode - Host Registration";
                    string body = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #7c3aed; border-radius: 12px;'>
                            <h2 style='color: #7c3aed;'>Hello {s.HostName}!</h2>
                            <p style='font-size: 16px; color: #333;'>Thank you for registering as a <b>Host</b> on <b>NexCode</b>!</p>
                            <p style='font-size: 16px; color: #333;'>Your application is currently pending admin approval. Once approved, you will be able to host hackathons and manage participants.</p>
                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='https://nex-code-two.vercel.app/' style='background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;'>Go to NexCode</a>
                            </div>
                            <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;' />
                            <p style='font-size: 12px; color: #999;'>Best regards,<br/>The NexCode Team</p>
                        </div>";
                    await _emailService.SendEmailAsync(s.Email, subject, body);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($@"[HostSignUpController] Failed to send welcome email: {ex.Message}");
                }

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
