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
        private readonly ProjectHackathon.Services.EmailService _emailService;
        private readonly IConfiguration _configuration;

        public ParticipantsSignUpController(IConfiguration configuration, ProjectHackathon.Services.EmailService emailService)
        {
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup([FromBody] ParticipantsSignUP s)
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

                // Send Welcome Email
                try
                {
                    string subject = "Welcome to NexCode!";
                    string body = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #7c3aed; border-radius: 12px;'>
                            <h2 style='color: #7c3aed;'>Hello {s.Firstname}!</h2>
                            <p style='font-size: 16px; color: #333;'>Welcome to <b>NexCode</b>! We're thrilled to have you join our global community of innovators.</p>
                            <p style='font-size: 16px; color: #333;'>Explore hackathons, build amazing projects, and connect with top developers from around the world.</p>
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
                    Console.WriteLine($@"[ParticipantsSignUpController] Failed to send welcome email: {ex.Message}");
                }

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
