namespace ProjectHackathon.Models
{
    public class UpdateApplicationStatusDto
    {
        public int ApplicationId { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
