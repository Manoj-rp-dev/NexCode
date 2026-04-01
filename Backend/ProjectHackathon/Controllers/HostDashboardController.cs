using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using ProjectHackathon.Models;

namespace ProjectHackathon.Controllers
{
    [Route("api/HostDashboard")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class HostDashboardController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string connectionString;

        public HostDashboardController(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet("GetProfile/{hostId}")]
        public IActionResult GetProfile(int hostId)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT HostID, HostName, HostType, OrganizationName, Email, Country, City, Username, Bio, Website, Industry, ProfileImage FROM Host WHERE HostID = @HostID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HostID", hostId);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        var profile = new
                        {
                            HostID = reader["HostID"],
                            HostName = reader["HostName"].ToString(),
                            HostType = reader["HostType"].ToString(),
                            OrganizationName = reader["OrganizationName"].ToString(),
                            Email = reader["Email"].ToString(),
                            Country = reader["Country"].ToString(),
                            City = reader["City"].ToString(),
                            Username = reader["Username"].ToString(),
                            Bio = reader["Bio"].ToString(),
                            Website = reader["Website"].ToString(),
                            Industry = reader["Industry"].ToString(),
                            ProfileImage = reader["ProfileImage"] != System.DBNull.Value ? (byte[])reader["ProfileImage"] : null
                        };
                        return Ok(profile);
                    }
                }
                return NotFound(new { message = "Host not found" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error loading profile", error = ex.Message });
            }
        }

        [HttpPost("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] HostProfileUpdateDto dto)
        {
            try
            {
                byte[] imageBytes = null;
                if (dto.ProfileImage != null)
                {
                    using (var ms = new MemoryStream())
                    {
                        await dto.ProfileImage.CopyToAsync(ms);
                        imageBytes = ms.ToArray();
                    }
                }

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = @"
                        UPDATE Host 
                        SET HostName = @HostName, 
                            OrganizationName = @OrgName, 
                            Bio = @Bio, 
                            Website = @Website, 
                            Industry = @Industry,
                            City = @City,
                            Country = @Country" + 
                        (imageBytes != null ? ", ProfileImage = @ProfileImage" : "") + 
                        " WHERE HostID = @HostID";

                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HostName", dto.HostName ?? "");
                    cmd.Parameters.AddWithValue("@OrgName", dto.OrganizationName ?? "");
                    cmd.Parameters.AddWithValue("@Bio", dto.Bio ?? "");
                    cmd.Parameters.AddWithValue("@Website", dto.Website ?? "");
                    cmd.Parameters.AddWithValue("@Industry", dto.Industry ?? "");
                    cmd.Parameters.AddWithValue("@City", dto.City ?? "");
                    cmd.Parameters.AddWithValue("@Country", dto.Country ?? "");
                    cmd.Parameters.AddWithValue("@HostID", dto.HostID);
                    if (imageBytes != null)
                        cmd.Parameters.AddWithValue("@ProfileImage", imageBytes);

                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = "Profile updated successfully" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error updating profile", error = ex.Message });
            }
        }

        [HttpGet("GetMyHackathons/{hostId}")]
        public IActionResult GetMyHackathons(int hostId)
        {
            try
            {
                var list = new List<object>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT 
                            HackathonID, HackathonName, HackathonType, Mode, 
                            ParticipationType, TeamSize, PrizePool, EventDate, 
                            Description, WebsiteLink, IsBlocked 
                        FROM HostHackathon 
                        WHERE HostID = @HostID
                        ORDER BY EventDate DESC";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HostID", hostId);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        list.Add(new
                        {
                            HackathonID = reader["HackathonID"],
                            HackathonName = reader["HackathonName"].ToString(),
                            HackathonType = reader["HackathonType"].ToString(),
                            Mode = reader["Mode"].ToString(),
                            ParticipationType = reader["ParticipationType"].ToString(),
                            TeamSize = reader["TeamSize"],
                            PrizePool = reader["PrizePool"],
                            EventDate = reader["EventDate"],
                            Description = reader["Description"].ToString(),
                            WebsiteLink = reader["WebsiteLink"].ToString(),
                            IsBlocked = reader["IsBlocked"] != DBNull.Value && Convert.ToBoolean(reader["IsBlocked"])
                        });
                    }
                    con.Close();
                }
                return Ok(list);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error loading hackathons", error = ex.Message });
            }
        }

        [HttpGet("GetDashboardStats/{hostId}")]
        public IActionResult GetDashboardStats(int hostId)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    
                    // Total Hackathons
                    string q1 = "SELECT COUNT(*) FROM HostHackathon WHERE HostID = @HostID";
                    SqlCommand c1 = new SqlCommand(q1, con);
                    c1.Parameters.AddWithValue("@HostID", hostId);
                    int totalHackathons = (int)c1.ExecuteScalar();

                    // Total Applicants across all hackathons
                    string q2 = @"
                        SELECT COUNT(A.ApplicationID) 
                        FROM HackathonApplications A 
                        INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID 
                        WHERE H.HostID = @HostID";
                    SqlCommand c2 = new SqlCommand(q2, con);
                    c2.Parameters.AddWithValue("@HostID", hostId);
                    int totalApplicants = (int)c2.ExecuteScalar();

                    // Total Prize Pool
                    string q3 = "SELECT ISNULL(SUM(CAST(PrizePool AS DECIMAL(18,2))), 0) FROM HostHackathon WHERE HostID = @HostID";
                    SqlCommand c3 = new SqlCommand(q3, con);
                    c3.Parameters.AddWithValue("@HostID", hostId);
                    decimal totalPrize = (decimal)c3.ExecuteScalar();

                    con.Close();

                    return Ok(new HostDashboardStatsDto
                    {
                        TotalHackathons = totalHackathons,
                        TotalApplicants = totalApplicants,
                        TotalPrizePool = totalPrize
                    });
                }
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error loading stats", error = ex.Message });
            }
        }

        [HttpGet("GetApplicants/{hackathonId}")]
        public IActionResult GetApplicants(int hackathonId)
        {
            try
            {
                var applicants = new List<HostApplicantDto>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT 
                            A.ApplicationID, 
                            A.ParticipantsID AS ParticipantId,
                            A.CollegeName, 
                            A.PortfolioUrl, 
                            A.Motivation, 
                            A.TeamMembers, 
                            A.AppliedAt,
                            A.IsWinner,
                            A.HasParticipated,
                            A.Status,
                            P.Firstname, 
                            P.Lastname, 
                            P.Email,
                            H.HackathonName,
                            PP.ProfileImage,
                            PP.Skill AS Skills,
                            PP.GithubLink,
                            (SELECT COUNT(*) FROM HackathonApplications WHERE ParticipantsID = A.ParticipantsID AND HasParticipated = 1) AS TotalParticipated,
                            (SELECT COUNT(*) FROM HackathonApplications WHERE ParticipantsID = A.ParticipantsID AND IsWinner = 1) AS TotalWins
                        FROM HackathonApplications A
                        INNER JOIN Participants P ON A.ParticipantsID = P.ParticipantsID
                        INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
                        LEFT JOIN ParticipantsProfile PP ON A.ParticipantsID = PP.ParticipantsID
                        WHERE A.HostHackathonID = @HackathonID
                        ORDER BY A.AppliedAt DESC";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HackathonID", hackathonId);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        applicants.Add(new HostApplicantDto
                        {
                            ApplicationId = (int)reader["ApplicationID"],
                            ParticipantId = (int)reader["ParticipantId"],
                            FullName = reader["Firstname"].ToString() + " " + reader["Lastname"].ToString(),
                            Email = reader["Email"].ToString(),
                            CollegeName = reader["CollegeName"].ToString(),
                            PortfolioUrl = reader["PortfolioUrl"].ToString(),
                            Motivation = reader["Motivation"].ToString(),
                            TeamMembers = reader["TeamMembers"].ToString(),
                            AppliedAt = (DateTime)reader["AppliedAt"],
                            HackathonName = reader["HackathonName"].ToString(),
                            ProfileImage = reader["ProfileImage"] != System.DBNull.Value ? (byte[])reader["ProfileImage"] : null,
                            Skills = reader["Skills"] != System.DBNull.Value ? reader["Skills"].ToString() : "Not Listed",
                            GithubLink = reader["GithubLink"] != System.DBNull.Value ? reader["GithubLink"].ToString() : "",
                            TotalParticipated = (int)reader["TotalParticipated"],
                            TotalWins = (int)reader["TotalWins"],
                            IsWinner = reader["IsWinner"] != System.DBNull.Value && Convert.ToBoolean(reader["IsWinner"]),
                            HasParticipated = reader["HasParticipated"] != System.DBNull.Value && Convert.ToBoolean(reader["HasParticipated"]), Status = reader["Status"].ToString()
                        });
                    }
                    con.Close();
                }
                return Ok(applicants);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error loading applicants", error = ex.Message });
            }
        }

        [HttpGet("GetNotifications/{hostId}")]
        public IActionResult GetNotifications(int hostId)
        {
            try
            {
                var notifications = new List<HostNotificationDto>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = @"
                        SELECT 
                            A.ApplicationID, 
                            P.Firstname + ' ' + P.Lastname AS ParticipantName,
                            H.HackathonName,
                            A.AppliedAt
                        FROM HackathonApplications A
                        INNER JOIN Participants P ON A.ParticipantsID = P.ParticipantsID
                        INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
                        WHERE H.HostID = @HostID AND (A.HostIsNotificationCleared = 0 OR A.HostIsNotificationCleared IS NULL)
                        ORDER BY A.AppliedAt DESC";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HostID", hostId);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        notifications.Add(new HostNotificationDto
                        {
                            ApplicationId = (int)reader["ApplicationID"],
                            ParticipantName = reader["ParticipantName"].ToString(),
                            HackathonName = reader["HackathonName"].ToString(),
                            AppliedAt = (DateTime)reader["AppliedAt"]
                        });
                    }
                }
                return Ok(notifications);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error loading notifications", error = ex.Message });
            }
        }

        [HttpPost("ClearNotifications/{hostId}")]
        public IActionResult ClearNotifications(int hostId)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = @"
                        UPDATE A
                        SET HostIsNotificationCleared = 1
                        FROM HackathonApplications A
                        INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
                        WHERE H.HostID = @HostID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HostID", hostId);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = "Notifications cleared" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error clearing notifications", error = ex.Message });
            }
        }

        [HttpGet("GetAllApplicants/{hostId}")]
        public IActionResult GetAllApplicants(int hostId)
        {
            try
            {
                var applicants = new List<HostApplicantDto>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = @"
                        WITH LatestApplications AS (
                            SELECT 
                                A.*,
                                ROW_NUMBER() OVER(PARTITION BY A.ParticipantsID ORDER BY A.AppliedAt DESC) as rn
                            FROM HackathonApplications A
                            INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
                            WHERE H.HostID = @HostID
                        )
                        SELECT 
                            LA.ApplicationID, 
                            LA.ParticipantsID AS ParticipantId,
                            LA.CollegeName, 
                            LA.PortfolioUrl, 
                            LA.Motivation, 
                            LA.TeamMembers, 
                            LA.AppliedAt,
                            LA.IsWinner,
                            LA.HasParticipated,
                            LA.Status,
                            P.Firstname, 
                            P.Lastname, 
                            P.Email,
                            H.HackathonName,
                            PP.ProfileImage,
                            PP.Skill AS Skills,
                            PP.GithubLink,
                            (SELECT COUNT(*) FROM HackathonApplications WHERE ParticipantsID = LA.ParticipantsID AND HasParticipated = 1) AS TotalParticipated,
                            (SELECT COUNT(*) FROM HackathonApplications WHERE ParticipantsID = LA.ParticipantsID AND IsWinner = 1) AS TotalWins
                        FROM LatestApplications LA
                        INNER JOIN Participants P ON LA.ParticipantsID = P.ParticipantsID
                        INNER JOIN HostHackathon H ON LA.HostHackathonID = H.HackathonID
                        LEFT JOIN ParticipantsProfile PP ON LA.ParticipantsID = PP.ParticipantsID
                        WHERE LA.rn = 1
                        ORDER BY LA.AppliedAt DESC";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HostID", hostId);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        applicants.Add(new HostApplicantDto
                        {
                            ApplicationId = (int)reader["ApplicationID"],
                            ParticipantId = (int)reader["ParticipantId"],
                            FullName = reader["Firstname"].ToString() + " " + reader["Lastname"].ToString(),
                            Email = reader["Email"].ToString(),
                            CollegeName = reader["CollegeName"].ToString(),
                            PortfolioUrl = reader["PortfolioUrl"].ToString(),
                            Motivation = reader["Motivation"].ToString(),
                            TeamMembers = reader["TeamMembers"].ToString(),
                            AppliedAt = (DateTime)reader["AppliedAt"],
                            HackathonName = reader["HackathonName"].ToString(),
                            ProfileImage = reader["ProfileImage"] != System.DBNull.Value ? (byte[])reader["ProfileImage"] : null,
                            Skills = reader["Skills"] != System.DBNull.Value ? reader["Skills"].ToString() : "Not Listed",
                            GithubLink = reader["GithubLink"] != System.DBNull.Value ? reader["GithubLink"].ToString() : "",
                            TotalParticipated = (int)reader["TotalParticipated"],
                            TotalWins = (int)reader["TotalWins"],
                            IsWinner = reader["IsWinner"] != System.DBNull.Value && Convert.ToBoolean(reader["IsWinner"]),
                            HasParticipated = reader["HasParticipated"] != System.DBNull.Value && Convert.ToBoolean(reader["HasParticipated"]), Status = reader["Status"].ToString()
                        });
                    }
                    con.Close();
                }
                return Ok(applicants);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error loading global talent", error = ex.Message });
            }
        }
        [HttpPost("UpdateWinnerStatus")]
        public IActionResult UpdateWinnerStatus([FromBody] UpdateStatusDto data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE HackathonApplications SET IsWinner = @IsWinner WHERE ApplicationID = @ApplicationID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@IsWinner", data.Status);
                    cmd.Parameters.AddWithValue("@ApplicationID", data.ApplicationId);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = "Winner status updated" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error updating winner status", error = ex.Message });
            }
        }

        [HttpPost("UpdateParticipationStatus")]
        public IActionResult UpdateParticipationStatus([FromBody] UpdateStatusDto data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE HackathonApplications SET HasParticipated = @HasParticipated WHERE ApplicationID = @ApplicationID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@HasParticipated", data.Status);
                    cmd.Parameters.AddWithValue("@ApplicationID", data.ApplicationId);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = "Participation status updated" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error updating participation status", error = ex.Message });
            }
        }

        [HttpPost("UpdateApplicationStatus")]
        public IActionResult UpdateApplicationStatus([FromBody] UpdateApplicationStatusDto data)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE HackathonApplications SET Status = @Status WHERE ApplicationID = @ApplicationID";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@Status", data.Status);
                    cmd.Parameters.AddWithValue("@ApplicationID", data.ApplicationId);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                }
                return Ok(new { message = "Application status updated successfully" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error updating application status", error = ex.Message });
            }
        }
    }
}
