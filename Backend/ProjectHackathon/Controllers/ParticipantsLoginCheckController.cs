using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsLoginCheckController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ParticipantsLoginCheckController(IConfiguration configuration)
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

        [HttpPost]
        [Route("login")]
        public IActionResult CheckLogin([FromBody] ParticipantsLogin l)
        {

            SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            string query = "SELECT ParticipantsID, UserPassword FROM Participants WHERE Username=@u";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@u", l.Username);

            con.Open();
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    int userId = Convert.ToInt32(reader["ParticipantsID"]);
                    string hashedPassword = reader["UserPassword"].ToString().Trim();
                    string enteredPassword = l.Password.Trim();

                    if (BCrypt.Net.BCrypt.Verify(enteredPassword, hashedPassword))
                    {
                        reader.Close();
                        con.Close();
                        string token = GenerateToken(userId.ToString(), "participant");
                        return Ok(new
                        {
                            token = token,
                            id = userId,
                            role = "participant",
                            message = "Login successful"
                        });
                    }
                    else
                    {
                        reader.Close();
                        con.Close();
                        return BadRequest(new { message = "Incorrect password" });
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
                        adminReader.Close();
                        con.Close();
                        string token = GenerateToken(adminId.ToString(), "admin");
                        return Ok(new { token = token, id = adminId, role = "admin" });
                    }
                    else
                    {
                        adminReader.Close();
                        con.Close();
                        return BadRequest(new { message = "Incorrect password for admin" });
                    }
                }
            }

            con.Close();
            return BadRequest(new { message = "Account not found" });
        }
    }
}
