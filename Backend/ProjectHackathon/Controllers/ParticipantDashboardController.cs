using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "participant,admin")]
    public class ParticipantDashboardController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string connectionString;

        public ParticipantDashboardController(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("GetAppliedHackathons/{participantsId}")]
        public IActionResult GetAppliedHackathons(int participantsId)
        {
            try
            {
                var appliedHackathons = new List<object>();

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT 
                            H.HackathonName,
                            H.HackathonID,
                            H.HackathonType,
                            H.ParticipationType,
                            H.PrizePool,
                            H.WebsiteLink,
                            A.AppliedAt,
                            A.ApplicationID,
                            A.IsWinner,
                            A.HasParticipated,
                            H.Mode,
                            Org.HostName,
                            Org.OrganizationName,
                            A.Status,
                            A.HostIsNotificationCleared,
                            H.ImageData
                        FROM HackathonApplications A
                        INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
                        INNER JOIN Host Org ON H.HostID = Org.HostID
                        WHERE A.ParticipantsID = @ParticipantsId
                        ORDER BY A.AppliedAt DESC";

                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ParticipantsId", participantsId);

                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        appliedHackathons.Add(new
                        {
                            ApplicationId = reader["ApplicationID"],
                            HackathonId = reader["HackathonID"],
                            HackathonName = reader["HackathonName"].ToString(),
                            HackathonType = reader["HackathonType"].ToString(),
                            ParticipationType = reader["ParticipationType"].ToString(),
                            PrizePool = reader["PrizePool"] != DBNull.Value ? Convert.ToDecimal(reader["PrizePool"]) : (decimal?)null,
                            WebsiteLink = reader["WebsiteLink"].ToString(),
                            AppliedAt = reader["AppliedAt"],
                            IsWinner = reader["IsWinner"] != System.DBNull.Value && Convert.ToBoolean(reader["IsWinner"]),
                            HasParticipated = reader["HasParticipated"] != System.DBNull.Value && Convert.ToBoolean(reader["HasParticipated"]),
                            Mode = reader["Mode"].ToString(),
                            HostName = reader["HostName"].ToString(),
                            OrganizationName = reader["OrganizationName"].ToString(),
                            Status = reader["Status"].ToString(),
                            IsNotificationCleared = reader["HostIsNotificationCleared"] != System.DBNull.Value && Convert.ToBoolean(reader["HostIsNotificationCleared"]),
                            ImageData = reader["ImageData"] != DBNull.Value ? (byte[])reader["ImageData"] : null
                        });
                    }
                    con.Close();
                }

                return Ok(appliedHackathons);
            }
            catch (SqlException ex)
            {
                return StatusCode(500, new { message = "Database error.", error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error loading dashboard", error = ex.Message });
            }
        }

        [HttpPost("ClearNotifications/{participantsId}")]
        public IActionResult ClearNotifications(int participantsId)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE HackathonApplications SET HostIsNotificationCleared = 1 WHERE ParticipantsID = @ParticipantsId";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ParticipantsId", participantsId);

                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = "Notifications cleared successfully." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error clearing notifications.", error = ex.Message });
            }
        }
    }
}
