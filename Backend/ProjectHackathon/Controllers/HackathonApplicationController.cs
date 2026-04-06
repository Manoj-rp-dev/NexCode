using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Text.Json;
using ProjectHackathon.Services;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class HackathonApplicationController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public HackathonApplicationController(EmailService emailService, IConfiguration config)
        {
            _emailService = emailService;
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }

        public class TeamMember
        {
            public string name { get; set; }
            public string email { get; set; }
        }

        public class ApplicationPayload
        {
            public int HackathonID { get; set; }
            public int ParticipantsID { get; set; }
            public string CollegeName { get; set; }
            public string PortfolioUrl { get; set; }
            public string Motivation { get; set; }
            public string TeamMembers { get; set; }
        }

        [HttpPost("Apply")]
        public async Task<IActionResult> Apply([FromBody] ApplicationPayload p)
        {
            Console.WriteLine($"[HackathonApplicationController] Applying for Hackathon ID: {p.HackathonID}, Participant ID: {p.ParticipantsID}");
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();

                    // 1. Call the new Stored Procedure instead of raw SQL
                    using (SqlCommand cmd = new SqlCommand("sp_ApplyForHackathon", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@HostHackathonID", p.HackathonID);
                        cmd.Parameters.AddWithValue("@ParticipantsID", p.ParticipantsID);
                        cmd.Parameters.AddWithValue("@CollegeName", p.CollegeName ?? string.Empty);
                        cmd.Parameters.AddWithValue("@PortfolioUrl", p.PortfolioUrl ?? string.Empty);
                        cmd.Parameters.AddWithValue("@Motivation", p.Motivation ?? string.Empty);
                        cmd.Parameters.AddWithValue("@TeamMembers", p.TeamMembers ?? string.Empty);

                        cmd.ExecuteNonQuery();
                    }

                    Console.WriteLine($"[HackathonApplicationController] Application saved via Stored Procedure for Participant ID: {p.ParticipantsID}");
                    Console.WriteLine($"[HackathonApplicationController] Application saved successfully for Participant ID: {p.ParticipantsID}");

                    // After successful submission, check team members and send invitation emails if they aren't registered
                    if (!string.IsNullOrEmpty(p.TeamMembers))
                    {
                        try
                        {
                            Console.WriteLine($"[HackathonApplicationController] Processing Team Members: {p.TeamMembers}");
                            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                            var members = JsonSerializer.Deserialize<List<TeamMember>>(p.TeamMembers, options);
                            
                            if (members != null && members.Count > 0)
                            {
                                foreach (var member in members)
                                {
                                    string memberEmail = member.email?.Trim();
                                    string memberName = member.name?.Trim();

                                    if (string.IsNullOrEmpty(memberEmail))
                                    {
                                        Console.WriteLine("[HackathonApplicationController] Skipping member with empty email.");
                                        continue;
                                    }

                                    Console.WriteLine($"[HackathonApplicationController] Checking existence for: {memberEmail}");
                                    
                                    // Check if email exists in Participants table
                                    string checkQuery = "SELECT COUNT(*) FROM Participants WHERE Email = @Email";
                                    using (SqlCommand checkCmd = new SqlCommand(checkQuery, con))
                                    {
                                        checkCmd.Parameters.AddWithValue("@Email", memberEmail);
                                        int exists = (int)checkCmd.ExecuteScalar();
                                        Console.WriteLine($"[HackathonApplicationController] Existence check for {memberEmail}: {exists}");

                                        if (exists == 0)
                                        {
                                            // Email doesn't exist, send invitation
                                            string subject = "You've been invited to join NexCode!";
                                            string websiteLink = "https://nex-code-two.vercel.app/"; 
                                            string body = $@"
                                                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #7c3aed; border-radius: 20px; background-color: #ffffff;'>
                                                    <h1 style='color: #7c3aed; font-size: 28px; margin-bottom: 24px;'>Hello {memberName}!</h1>
                                                    <p style='font-size: 18px; color: #334155; line-height: 1.6; margin-bottom: 20px;'>One of your teammates has just invited you to participate in a hackathon on the <b style='color: #7c3aed;'>NexCode</b> platform.</p>
                                                    <p style='font-size: 18px; color: #334155; line-height: 1.6; margin-bottom: 32px;'>It looks like you don't have an account yet. Join NexCode to build innovation, compete with top developers, and win amazing prizes!</p>
                                                    <div style='text-align: center; margin: 40px 0;'>
                                                        <a href='{websiteLink}' style='background-color: #7c3aed; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 20px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);'>Join NexCode Now</a>
                                                    </div>
                                                    <p style='font-size: 16px; color: #64748b; margin-top: 40px;'>If you have any questions, feel free to visit our website.</p>
                                                    <hr style='border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;' />
                                                    <p style='font-size: 14px; color: #94a3b8; font-weight: 500;'>Best regards,<br/><span style='color: #7c3aed;'>The NexCode Team</span></p>
                                                </div>";

                                            Console.WriteLine($"[HackathonApplicationController] Triggering email for {memberEmail}...");
                                            await _emailService.SendEmailAsync(memberEmail, subject, body);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                Console.WriteLine("[HackathonApplicationController] No team members found in the payload.");
                            }
                        }
                        catch (Exception ex)
                        {
                            // Log error but don't fail the whole application process
                            Console.WriteLine($"[HackathonApplicationController] Error processing team member emails: {ex.Message}");
                        }
                    }

                    con.Close();
                }

                return Ok(new { message = "Application submitted successfully" });
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627 || ex.Number == 2601)
                {
                    return BadRequest(new { message = "You have already applied for this hackathon." });
                }
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error.", error = ex.Message });
            }
        }
    }
}
