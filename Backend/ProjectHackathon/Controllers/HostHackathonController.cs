using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class HostHackathonController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public HostHackathonController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection")!;
        }

        [HttpPost("CreateHackathon")]
        public async Task<IActionResult> CreateHackathon([FromForm] HostHackathons h)
        {
            byte[] imageBytes;

            using (MemoryStream ms = new MemoryStream())
            {
                await h.Photo.CopyToAsync(ms);
                imageBytes = ms.ToArray();
            }

            if (h.ParticipationType == "Team" && (!h.TeamSize.HasValue || h.TeamSize < 2))
            {
                return BadRequest(new { message = "Team size must be at least 2 for team hackathons." });
            }

            SqlConnection con = new SqlConnection(_connectionString);

            string query = "INSERT INTO HostHackathon (HostID, HackathonName, HackathonType, Mode, ParticipationType, TeamSize, PrizePool, EventDate, RegistrationStartDate, RegistrationEndDate, ImageData, Description, WebsiteLink) VALUES (@HostID, @HackathonName, @HackathonType, @Mode, @ParticipationType, @TeamSize, @PrizePool, @EventDate, @RegistrationStartDate, @RegistrationEndDate, @ImageData, @Description, @WebsiteLink)";

            SqlCommand cmd = new SqlCommand(query, con);

            cmd.Parameters.AddWithValue("@HostID", h.HostID);
            cmd.Parameters.AddWithValue("@HackathonName", h.HackathonName);
            cmd.Parameters.AddWithValue("@HackathonType", h.HackathonType);
            cmd.Parameters.AddWithValue("@Mode", h.Mode);
            cmd.Parameters.AddWithValue("@ParticipationType", h.ParticipationType);
            cmd.Parameters.AddWithValue("@TeamSize", h.TeamSize ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@PrizePool", h.PrizePool ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@EventDate", h.EventDate);
            cmd.Parameters.AddWithValue("@RegistrationStartDate", h.RegistrationStartDate ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@RegistrationEndDate", h.RegistrationEndDate ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@ImageData", imageBytes);
            cmd.Parameters.AddWithValue("@Description", h.Description);
            cmd.Parameters.AddWithValue("@WebsiteLink", h.WebsiteLink ?? (object)DBNull.Value);

            con.Open();
            cmd.ExecuteNonQuery();
            con.Close();

            return Ok(new { message = "Hackathon Saved" });
        }
        [HttpDelete("DeleteHackathon/{id}")]
        public IActionResult DeleteHackathon(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    string query = "DELETE FROM HostHackathon WHERE HackathonID = @ID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ID", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = "Hackathon deleted successfully" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting hackathon", error = ex.Message });
            }
        }

        [HttpPost("ToggleBlockHackathon/{id}")]
        public IActionResult ToggleBlockHackathon(int id, [FromBody] bool status)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    string query = "UPDATE HostHackathon SET IsBlocked = @Status WHERE HackathonID = @ID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@Status", status);
                    cmd.Parameters.AddWithValue("@ID", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = status ? "Hackathon blocked" : "Hackathon unblocked" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error toggling block status", error = ex.Message });
            }
        }
    }
}
