using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;
using System.Collections.Generic;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HackathonListController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public HackathonListController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetAll")]
        public IActionResult GetAllHackathons()
        {
            try
            {
                List<HackathonListItem> hackathons = new List<HackathonListItem>();

                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    // Join HostHackathon and Host tables on HostID to retrieve the OrganizationName for the GUI Card
                    string query = @"
                        SELECT 
                            H.HackathonID, H.HostID, Org.HostName, Org.OrganizationName, 
                            H.HackathonName, H.HackathonType, H.Mode, H.ParticipationType, H.TeamSize,
                            H.PrizePool, H.EventDate, H.Description, H.WebsiteLink, H.ImageData,
                            Org.ProfileImage AS HostLogo
                        FROM HostHackathon H
                        INNER JOIN Host Org ON H.HostID = Org.HostID
                        WHERE ISNULL(H.IsBlocked, 0) = 0 AND H.EventDate >= CAST(GETDATE() AS DATE)
                        ORDER BY H.EventDate DESC";

                    SqlCommand cmd = new SqlCommand(query, con);

                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        HackathonListItem item = new HackathonListItem();
                        item.HackathonID = Convert.ToInt32(reader["HackathonID"]);
                        item.HostID = Convert.ToInt32(reader["HostID"]);
                        item.HostName = reader["HostName"].ToString();
                        item.OrganizationName = reader["OrganizationName"].ToString();
                        item.HackathonName = reader["HackathonName"].ToString();
                        item.HackathonType = reader["HackathonType"].ToString();
                        item.Mode = reader["Mode"].ToString();
                        item.ParticipationType = reader["ParticipationType"].ToString();
                        item.TeamSize = reader["TeamSize"] != DBNull.Value ? Convert.ToInt32(reader["TeamSize"]) : null;
                        item.PrizePool = reader["PrizePool"] != DBNull.Value ? Convert.ToDecimal(reader["PrizePool"]) : null;
                        item.EventDate = Convert.ToDateTime(reader["EventDate"]);
                        item.Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null;
                        item.WebsiteLink = reader["WebsiteLink"] != DBNull.Value ? reader["WebsiteLink"].ToString() : null;
                        
                        if (reader["ImageData"] != DBNull.Value)
                        {
                            item.ImageData = (byte[])reader["ImageData"];
                        }

                        if (reader["HostLogo"] != DBNull.Value)
                        {
                            item.HostLogo = (byte[])reader["HostLogo"];
                        }

                        hackathons.Add(item);
                    }
                    con.Close();
                }

                return Ok(hackathons);
            }
            catch (SqlException ex)
            {
                return StatusCode(500, new { message = "Database error.", error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error.", error = ex.Message });
            }
        }
    }
}
