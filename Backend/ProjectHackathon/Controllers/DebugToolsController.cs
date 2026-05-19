using Microsoft.AspNetCore.Mvc;

namespace ProjectHackathon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DebugToolsController : ControllerBase
    {
        // IMPORTANT: Delete this controller after you have fixed your login.
        // Usage: /api/DebugTools/GetHash/admin123
        [HttpGet("GetHash/{text}")]
        public IActionResult GetHash(string text)
        {
            try
            {
                // Generates a hash using the server's own library version
                string hash = BCrypt.Net.BCrypt.HashPassword(text);
                return Ok(new { 
                    originalText = text, 
                    generatedHash = hash,
                    note = "Copy this hash and update your Admin table with it."
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
