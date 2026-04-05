using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HostLoginCheckController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public HostLoginCheckController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GenerateToken(string userId, string role)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = System.Text.Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

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
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
                signingCredentials: new Microsoft.IdentityModel.Tokens.SigningCredentials(
                    new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
                    Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256)
            );

            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }

        private string connectionString;

        [HttpPost("login")]
        public IActionResult CheckLogin([FromBody] HostLogin l)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT HostID, UserPassword, IsApproved FROM Host WHERE Username=@u";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@u", l.Username);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            int userId = Convert.ToInt32(reader["HostID"]);
                            string storedPassword = reader["UserPassword"].ToString().Trim();
                            bool isApproved = Convert.ToBoolean(reader["IsApproved"]);

                            if (BCrypt.Net.BCrypt.Verify(l.Password, storedPassword))
                            {
                                if (!isApproved)
                                {
                                    return BadRequest(new { message = "Your account is awaiting admin approval." });
                                }

                                string token = GenerateToken(userId.ToString(), "host");
                                return Ok(new { token = token, id = userId, role = "host" });
                            }
                        }
                    }

                    // Fallback for Admin
                    string adminQuery = "SELECT AdminID, UserPassword FROM Admin WHERE Username=@u";
                    SqlCommand adminCmd = new SqlCommand(adminQuery, con);
                    adminCmd.Parameters.AddWithValue("@u", l.Username);
                    using (SqlDataReader adminReader = adminCmd.ExecuteReader())
                    {
                        if (adminReader.Read())
                        {
                            int adminId = Convert.ToInt32(adminReader["AdminID"]);
                            string storedPassword = adminReader["UserPassword"].ToString().Trim();

                            if (BCrypt.Net.BCrypt.Verify(l.Password, storedPassword))
                            {
                                string token = GenerateToken(adminId.ToString(), "admin");
                                return Ok(new { token = token, id = adminId, role = "admin" });
                            }
                        }
                    }
                }

                return BadRequest(new { message = "Login failed" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server Exception: " + ex.Message });
            }
        }
    }
}
