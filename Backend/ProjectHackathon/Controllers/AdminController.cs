using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public AdminController(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        private string connectionString;

        [HttpPost("login")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        public IActionResult Login([FromBody] AdminLogin l)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT AdminID, UserPassword FROM Admin WHERE Username=@u";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@u", l.Username);
                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        int adminId = Convert.ToInt32(reader["AdminID"]);
                        string storedPassword = reader["UserPassword"].ToString().Trim();
                        string enteredPassword = l.Password.Trim();

                        bool isPasswordMatch = false;
                        if (storedPassword.StartsWith("$2a$") || storedPassword.StartsWith("$2b$") || storedPassword.StartsWith("$2y$"))
                        {
                            try {
                                isPasswordMatch = BCrypt.Net.BCrypt.Verify(enteredPassword, storedPassword);
                            } catch {
                                isPasswordMatch = (enteredPassword == storedPassword);
                            }
                        }
                        else
                        {
                            isPasswordMatch = (enteredPassword == storedPassword);
                        }

                        if (isPasswordMatch)
                        {
                            string token = GenerateToken(adminId.ToString(), "admin");
                            return Ok(new { token = token, id = adminId, role = "admin" });
                        }
                    }
                }
                return BadRequest(new { message = "Login failed" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private string GenerateToken(string userId, string role)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var keyStr = jwtSettings["Key"]!;
            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(keyStr));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, userId),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, role),
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
                signingCredentials: creds
            );
            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("Stats")]
        public IActionResult GetStats()
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    var stats = new
                    {
                        TotalUsers = (int)new SqlCommand("SELECT COUNT(*) FROM Participants", con).ExecuteScalar(),
                        TotalHosts = (int)new SqlCommand("SELECT COUNT(*) FROM Host WHERE IsApproved = 1", con).ExecuteScalar(),
                        TotalHackathons = (int)new SqlCommand("SELECT COUNT(*) FROM HostHackathon", con).ExecuteScalar(),
                        TotalApplications = (int)new SqlCommand("SELECT COUNT(*) FROM HackathonApplications", con).ExecuteScalar(),
                        TotalPending = (int)new SqlCommand("SELECT COUNT(*) FROM Host WHERE IsApproved = 0", con).ExecuteScalar(),
                        TotalBlocked = (int)new SqlCommand("SELECT COUNT(*) FROM Host WHERE IsBlocked = 1", con).ExecuteScalar()
                    };
                    return Ok(stats);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("Participants")]
        public IActionResult GetParticipants()
        {
            try
            {
                var list = new List<object>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT ParticipantsID, Firstname, Lastname, Email, Dob, Degree, Collegename FROM Participants";
                    SqlCommand cmd = new SqlCommand(query, con);
                    con.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        list.Add(new
                        {
                            Id = r["ParticipantsID"],
                            FirstName = r["Firstname"],
                            LastName = r["Lastname"],
                            FullName = r["Firstname"] + " " + r["Lastname"],
                            Email = r["Email"],
                            Dob = r["Dob"],
                            Degree = r["Degree"],
                            College = r["Collegename"]
                        });
                    }
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("Hosts")]
        public IActionResult GetHosts()
        {
            try
            {
                var list = new List<object>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT HostID, HostName, HostType, OrganizationName, Email, Country, City, IsApproved, IsBlocked FROM Host";
                    SqlCommand cmd = new SqlCommand(query, con);
                    con.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        list.Add(new
                        {
                            Id = r["HostID"],
                            HostName = r["HostName"],
                            HostType = r["HostType"],
                            Org = r["OrganizationName"],
                            Email = r["Email"],
                            Country = r["Country"],
                            City = r["City"],
                            IsApproved = r["IsApproved"],
                            IsBlocked = r["IsBlocked"]
                        });
                    }
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("Hackathons")]
        public IActionResult GetHackathons()
        {
            try
            {
                var list = new List<object>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT HackathonID, HackathonName, ParticipationType, EventDate FROM HostHackathon";
                    SqlCommand cmd = new SqlCommand(query, con);
                    con.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        list.Add(new
                        {
                            Id = r["HackathonID"],
                            Name = r["HackathonName"],
                            Type = r["ParticipationType"],
                            Date = r["EventDate"]
                        });
                    }
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("Participant/{id}")]
        public IActionResult DeleteParticipant(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM Participants WHERE ParticipantsID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return Ok(new { message = "Participant deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("Host/{id}")]
        public IActionResult DeleteHost(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM Host WHERE HostID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return Ok(new { message = "Host deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("Hackathon/{id}")]
        public IActionResult DeleteHackathon(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM HostHackathon WHERE HackathonID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                return Ok(new { message = "Hackathon deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("PendingHosts")]
        public IActionResult GetPendingHosts()
        {
            try
            {
                var list = new List<object>();
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT HostID, HostName, OrganizationName, Email, HostType, City FROM Host WHERE IsApproved = 0";
                    SqlCommand cmd = new SqlCommand(query, con);
                    con.Open();
                    SqlDataReader r = cmd.ExecuteReader();
                    while (r.Read())
                    {
                        list.Add(new
                        {
                            Id = r["HostID"],
                            HostName = r["HostName"],
                            Org = r["OrganizationName"],
                            Email = r["Email"],
                            Type = r["HostType"],
                            City = r["City"]
                        });
                    }
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("ApproveHost/{id}")]
        public IActionResult ApproveHost(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE Host SET IsApproved = 1 WHERE HostID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return Ok(new { message = "Host approved" });
                }
                return NotFound(new { message = "Host not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("BlockHost/{id}")]
        public IActionResult BlockHost(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE Host SET IsBlocked = 1 WHERE HostID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return Ok(new { message = "Host blocked" });
                }
                return NotFound(new { message = "Host not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("UnblockHost/{id}")]
        public IActionResult UnblockHost(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE Host SET IsBlocked = 0 WHERE HostID=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id", id);
                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return Ok(new { message = "Host unblocked" });
                }
                return NotFound(new { message = "Host not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
