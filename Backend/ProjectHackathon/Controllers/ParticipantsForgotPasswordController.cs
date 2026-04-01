using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjectHackathon.Models;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsForgotPasswordController : ControllerBase
    {
        private string connectionString =
        "Data Source=MANOJ\\SQLEXPRESS;Initial Catalog=Project;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

        [HttpPost("reset")]
        public IActionResult ResetPassword([FromBody] ParticipantsForgotPassword model)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    // First, verify if the user exists with the given username and email
                    string verifyQuery = "SELECT COUNT(*) FROM Participants WHERE Username=@Username AND Email=@Email";
                    SqlCommand verifyCmd = new SqlCommand(verifyQuery, con);
                    verifyCmd.Parameters.AddWithValue("@Username", model.Username);
                    verifyCmd.Parameters.AddWithValue("@Email", model.Email);

                    con.Open();
                    int count = (int)verifyCmd.ExecuteScalar();

                    if (count == 0)
                    {
                        con.Close();
                        return BadRequest(new { message = "Invalid username or email." });
                    }

                    // User exists, now update the password
                    string updateQuery = "UPDATE Participants SET UserPassword=@NewPassword WHERE Username=@Username AND Email=@Email";
                    SqlCommand updateCmd = new SqlCommand(updateQuery, con);
                    string hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
                    updateCmd.Parameters.AddWithValue("@NewPassword", hashedNewPassword);
                    updateCmd.Parameters.AddWithValue("@Username", model.Username);
                    updateCmd.Parameters.AddWithValue("@Email", model.Email);

                    int rowsAffected = updateCmd.ExecuteNonQuery();
                    con.Close();

                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "Password updated successfully." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Failed to update password." });
                    }
                }
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
